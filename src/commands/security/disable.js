const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildSettings, updateGuildSettings } = require('../../database/settingsStore');
const { protectionCatalog, protectionChoices } = require('../../constants/protectionCatalog');

function disablePatch(protectionName, settings) {
  const protection = protectionCatalog[protectionName];
  if (!protection) return null;

  if (protection.type === 'enableAll') {
    return {
      systems: Object.fromEntries(Object.keys(settings.systems).map((key) => [key, false])),
      antiNuke: { ...settings.antiNuke, enabled: false }
    };
  }

  if (protection.type === 'system') {
    return { systems: { ...settings.systems, [protection.key]: false } };
  }

  if (protection.type === 'antiSpam') {
    const resetValue = protection.key === 'mentionLimit' ? 5 : false;
    return { antiSpam: { ...settings.antiSpam, [protection.key]: resetValue } };
  }

  if (protection.type === 'antiNukeLimit') {
    return {
      antiNuke: { ...settings.antiNuke, [protection.key]: 30 }
    };
  }

  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disable')
    .setDescription('إيقاف نظام حماية')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((opt) => opt.setName('protection').setDescription('نوع الحماية').setRequired(true).addChoices(...protectionChoices)),

  async execute(interaction) {
    const protectionName = interaction.options.getString('protection', true);

    const settings = await getGuildSettings(interaction.guildId);
    const patch = disablePatch(protectionName, settings);

    if (!patch) {
      return interaction.reply({ ephemeral: true, content: '❌ خيار حماية غير معروف.' });
    }

    await updateGuildSettings(interaction.guildId, patch);
    const label = protectionCatalog[protectionName].label;

    return interaction.reply({
      ephemeral: true,
      content: `✅ تم تعطيل **${label}**.`
    });
  }
};
