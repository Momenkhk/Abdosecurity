const { Collection, PermissionsBitField, AuditLogEvent } = require('discord.js');
const { getGuildSettings } = require('../database/settingsStore');
const config = require('../utils/config');
const logger = require('../utils/logger');

const userMessageBuckets = new Collection();
const joinBuckets = new Collection();
const abuseBuckets = new Collection();

function pushBucketEntry(bucket, key, windowMs = 8000) {
  const now = Date.now();
  const arr = bucket.get(key) || [];
  const filtered = arr.filter((time) => now - time < windowMs);
  filtered.push(now);
  bucket.set(key, filtered);
  return filtered.length;
}

function isWhitelisted(member, settings) {
  if (!member) return false;
  if (settings.whitelist.ownerBypass && member.id === config.ownerId) return true;
  if (settings.whitelist.users.includes(member.id)) return true;
  return member.roles.cache.some((role) => settings.whitelist.roles.includes(role.id));
}

async function applyPunishment(member, type, reason) {
  try {
    if (!member || !member.manageable || member.id === config.ownerId) return;
    if (type === 'ban' && member.bannable) return member.ban({ reason });
    if (type === 'kick' && member.kickable) return member.kick(reason);
    if (type === 'remove_roles') {
      const removableRoles = member.roles.cache.filter((r) => !r.managed && r.editable);
      return member.roles.remove(removableRoles, reason);
    }
    return member.timeout(60 * 60 * 1000, reason);
  } catch (error) {
    logger.error('Failed to apply punishment:', error.message);
  }
}

async function checkAntiNukeByAudit(guild, actionType, keyName, reasonText) {
  const settings = await getGuildSettings(guild.id);
  if (!settings.systems.antiNuke || !settings.antiNuke.enabled) return;

  const fetched = await guild.fetchAuditLogs({ type: actionType, limit: 1 }).catch(() => null);
  const entry = fetched?.entries?.first();
  if (!entry || !entry.executorId) return;

  const member = await guild.members.fetch(entry.executorId).catch(() => null);
  if (!member || member.user.bot || isWhitelisted(member, settings)) return;

  const limit = settings.antiNuke[keyName] || 3;
  const current = pushBucketEntry(abuseBuckets, `${guild.id}:${entry.executorId}:${keyName}`, 15_000);
  if (current >= limit) {
    await applyPunishment(member, settings.antiNuke.punishment, reasonText);
    logger.warn(`[SECURITY] ${reasonText} | guild=${guild.id} user=${entry.executorId}`);
  }
}

async function handleMessageSecurity(message) {
  if (!message.guild || message.author.bot) return;
  const settings = await getGuildSettings(message.guild.id);
  if (!settings.systems?.antiSpam) return;

  const key = `${message.guild.id}:${message.author.id}`;
  const count = pushBucketEntry(userMessageBuckets, key, settings.antiSpam.messageWindowMs);
  const mentionCount = message.mentions.users.size;
  const capsRatio = message.content ? message.content.replace(/[^A-Z]/g, '').length / Math.max(message.content.length, 1) : 0;
  const emojiCount = (message.content.match(/<a?:\w+:\d+>|[\u{1F300}-\u{1FAFF}]/gu) || []).length;

  const isInvite = /discord\.gg\//i.test(message.content);
  const isLink = /https?:\/\//i.test(message.content);

  const spamTriggered =
    count > settings.antiSpam.messageLimit ||
    mentionCount > settings.antiSpam.mentionLimit ||
    capsRatio > settings.antiSpam.capsRatioLimit ||
    emojiCount > settings.antiSpam.emojiLimit ||
    (settings.antiSpam.blockInvites && isInvite) ||
    (settings.antiSpam.blockLinks && isLink);

  if (spamTriggered) {
    await message.delete().catch(() => null);
    const member = await message.guild.members.fetch(message.author.id).catch(() => null);
    if (!isWhitelisted(member, settings)) {
      await applyPunishment(member, settings.antiNuke.punishment, 'مكافحة السبام: نشاط مريب');
    }
  }
}

async function handleMemberJoinSecurity(member) {
  const settings = await getGuildSettings(member.guild.id);
  if (!settings.systems?.antiRaid) return;

  const joins = pushBucketEntry(joinBuckets, `${member.guild.id}:joins`, 15000);
  const accountAgeDays = (Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24);

  if (joins > settings.raidProtection.joinRateLimit || accountAgeDays < settings.raidProtection.suspiciousAccountDays) {
    if (settings.raidProtection.autoLockdown) {
      const everyone = member.guild.roles.everyone;
      await everyone.setPermissions(everyone.permissions.remove(PermissionsBitField.Flags.SendMessages), 'Auto Lockdown').catch(() => null);
    }
    if (settings.raidProtection.autoMute) {
      await member.timeout(30 * 60 * 1000, 'حماية من هجوم محتمل').catch(() => null);
    }
  }

  if (member.user.bot && settings.systems.antiBotAdd) {
    await checkAntiNukeByAudit(member.guild, AuditLogEvent.BotAdd, 'botAddLimit', 'محاولة إضافة بوتات بشكل مريب');
  }
}

module.exports = {
  handleMessageSecurity,
  handleMemberJoinSecurity,
  checkAntiNukeByAudit,
  applyPunishment,
  AuditLogEvent
};
