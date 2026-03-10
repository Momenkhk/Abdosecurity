const { readStore, writeStore, ensureStore } = require('./jsonStore');

const defaultSettings = {
  antiNuke: {
    enabled: true,
    channelCreateLimit: 3,
    channelDeleteLimit: 2,
    channelUpdateLimit: 5,
    roleCreateLimit: 3,
    roleDeleteLimit: 2,
    roleUpdateLimit: 5,
    banLimit: 3,
    kickLimit: 4,
    webhookCreateLimit: 2,
    botAddLimit: 1,
    punishment: 'ban'
  },
  systems: {
    antiNuke: true,
    antiSpam: true,
    antiRaid: true,
    antiBotAdd: true,
    antiWebhook: true,
    antiRoleAbuse: true,
    antiChannelAbuse: true,
    antiPermissionAbuse: true
  },
  antiSpam: {
    messageLimit: 6,
    messageWindowMs: 7000,
    mentionLimit: 5,
    capsRatioLimit: 0.75,
    emojiLimit: 12,
    blockInvites: true,
    blockLinks: false
  },
  raidProtection: {
    autoLockdown: true,
    joinRateLimit: 8,
    suspiciousAccountDays: 7,
    autoSlowmode: true,
    autoMute: true
  },
  whitelist: {
    users: [],
    roles: [],
    ownerBypass: true
  },
  logs: {
    member: null,
    channel: null,
    role: null,
    security: null,
    message: null
  },
  verification: {
    buttonEnabled: true,
    captchaEnabled: false,
    minAccountAgeDays: 7,
    antiAltDetection: true
  },
  backup: {
    autoBackup: true,
    items: []
  },
  panicMode: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const num = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;

function sanitizeSettingsPatch(input = {}) {
  const patch = {};

  if (typeof input.panicMode === 'boolean') patch.panicMode = input.panicMode;

  if (input.systems && typeof input.systems === 'object') {
    patch.systems = {};
    for (const key of Object.keys(defaultSettings.systems)) {
      if (typeof input.systems[key] === 'boolean') patch.systems[key] = input.systems[key];
    }
  }

  if (input.whitelist && typeof input.whitelist === 'object') {
    patch.whitelist = {};
    if (Array.isArray(input.whitelist.users)) patch.whitelist.users = input.whitelist.users.filter((v) => typeof v === 'string').slice(0, 300);
    if (Array.isArray(input.whitelist.roles)) patch.whitelist.roles = input.whitelist.roles.filter((v) => typeof v === 'string').slice(0, 300);
    if (typeof input.whitelist.ownerBypass === 'boolean') patch.whitelist.ownerBypass = input.whitelist.ownerBypass;
  }

  if (input.antiNuke && typeof input.antiNuke === 'object') {
    patch.antiNuke = {};
    for (const [key, value] of Object.entries(input.antiNuke)) {
      if (key === 'punishment' && ['ban', 'kick', 'remove_roles', 'timeout'].includes(value)) patch.antiNuke[key] = value;
      if (key === 'enabled' && typeof value === 'boolean') patch.antiNuke[key] = value;
      if (typeof defaultSettings.antiNuke[key] === 'number' && num(value, 1, 30)) patch.antiNuke[key] = Math.floor(value);
    }
  }

  if (input.antiSpam && typeof input.antiSpam === 'object') {
    patch.antiSpam = {};
    if (num(input.antiSpam.messageLimit, 2, 30)) patch.antiSpam.messageLimit = Math.floor(input.antiSpam.messageLimit);
    if (num(input.antiSpam.messageWindowMs, 1000, 60000)) patch.antiSpam.messageWindowMs = Math.floor(input.antiSpam.messageWindowMs);
    if (num(input.antiSpam.mentionLimit, 1, 30)) patch.antiSpam.mentionLimit = Math.floor(input.antiSpam.mentionLimit);
    if (num(input.antiSpam.capsRatioLimit, 0.2, 1)) patch.antiSpam.capsRatioLimit = Number(input.antiSpam.capsRatioLimit);
    if (num(input.antiSpam.emojiLimit, 1, 100)) patch.antiSpam.emojiLimit = Math.floor(input.antiSpam.emojiLimit);
    if (typeof input.antiSpam.blockInvites === 'boolean') patch.antiSpam.blockInvites = input.antiSpam.blockInvites;
    if (typeof input.antiSpam.blockLinks === 'boolean') patch.antiSpam.blockLinks = input.antiSpam.blockLinks;
  }

  if (input.raidProtection && typeof input.raidProtection === 'object') {
    patch.raidProtection = {};
    if (typeof input.raidProtection.autoLockdown === 'boolean') patch.raidProtection.autoLockdown = input.raidProtection.autoLockdown;
    if (num(input.raidProtection.joinRateLimit, 2, 50)) patch.raidProtection.joinRateLimit = Math.floor(input.raidProtection.joinRateLimit);
    if (num(input.raidProtection.suspiciousAccountDays, 1, 365)) patch.raidProtection.suspiciousAccountDays = Math.floor(input.raidProtection.suspiciousAccountDays);
    if (typeof input.raidProtection.autoSlowmode === 'boolean') patch.raidProtection.autoSlowmode = input.raidProtection.autoSlowmode;
    if (typeof input.raidProtection.autoMute === 'boolean') patch.raidProtection.autoMute = input.raidProtection.autoMute;
  }

  if (input.verification && typeof input.verification === 'object') {
    patch.verification = {};
    if (typeof input.verification.buttonEnabled === 'boolean') patch.verification.buttonEnabled = input.verification.buttonEnabled;
    if (typeof input.verification.captchaEnabled === 'boolean') patch.verification.captchaEnabled = input.verification.captchaEnabled;
    if (num(input.verification.minAccountAgeDays, 0, 365)) patch.verification.minAccountAgeDays = Math.floor(input.verification.minAccountAgeDays);
    if (typeof input.verification.antiAltDetection === 'boolean') patch.verification.antiAltDetection = input.verification.antiAltDetection;
  }

  if (input.logs && typeof input.logs === 'object') {
    patch.logs = {};
    for (const key of Object.keys(defaultSettings.logs)) {
      const value = input.logs[key];
      if (value === null || (typeof value === 'string' && /^\d{17,21}$/.test(value))) patch.logs[key] = value;
    }
  }

  if (input.backup && typeof input.backup === 'object') {
    patch.backup = {};
    if (typeof input.backup.autoBackup === 'boolean') patch.backup.autoBackup = input.backup.autoBackup;
  }

  return patch;
}

async function getGuildSettings(guildId) {
  ensureStore();
  const db = readStore();

  if (!db.guilds[guildId]) {
    db.guilds[guildId] = { guildId, ...structuredClone(defaultSettings) };
    writeStore(db);
  }

  return db.guilds[guildId];
}

function deepMerge(base, patch) {
  if (!patch || typeof patch !== 'object') return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = deepMerge(out[k] || {}, v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

async function updateGuildSettings(guildId, update) {
  ensureStore();
  const db = readStore();
  const safeUpdate = sanitizeSettingsPatch(update);

  const current = db.guilds[guildId] || { guildId, ...structuredClone(defaultSettings) };
  db.guilds[guildId] = deepMerge(current, safeUpdate);
  db.guilds[guildId].updatedAt = new Date().toISOString();
  if (!db.guilds[guildId].createdAt) db.guilds[guildId].createdAt = new Date().toISOString();

  writeStore(db);
  return db.guilds[guildId];
}

module.exports = {
  defaultSettings,
  getGuildSettings,
  updateGuildSettings,
  sanitizeSettingsPatch,
  deepMerge
};
