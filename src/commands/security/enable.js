const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildSettings, updateGuildSettings } = require('../../database/settingsStore');
const { protectionCatalog, protectionChoices } = require('../../constants/protectionCatalog');

const punishmentChoices = [
  { name: 'ban', value: 'ban' },
  { name: 'kick', value: 'kick' },
  { name: 'timeout', value: 'timeout' },
  { name: 'remove_roles', value: 'remove_roles' }
];

function buildPatch(protectionName, currentSettings, punishment) {
  const protection = protectionCatalog[protectionName];
  if (!protection) return null;

  if (protection.type === 'enableAll') {
    return {
      systems: Object.fromEntries(Object.keys(currentSettings.systems).map((key) => [key, true])),
      antiNuke: { ...currentSettings.antiNuke, enabled: true, punishment }
    };
  }

  if (protection.type === 'system') {
    return {
      systems: {
        ...currentSettings.systems,
        [protection.key]: true
      },
      antiNuke: { ...currentSettings.antiNuke, punishment }
    };
  }

  if (protection.type === 'antiSpam') {
    return {
      antiSpam: {
        ...currentSettings.antiSpam,
        [protection.key]: protection.value ?? true
      },
      antiNuke: { ...currentSettings.antiNuke, punishment }
    };
  }

  if (protection.type === 'antiNukeLimit') {
    return {
      systems: { ...currentSettings.systems, antiNuke: true },
      antiNuke: {
        ...currentSettings.antiNuke,
        enabled: true,
        [protection.key]: Math.max(1, Number(currentSettings.antiNuke[protection.key] || 3)),
        punishment
      }
    };
  }

  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enable')
    .setDescription('تفعيل نظام حماية')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((opt) => opt.setName('protection').setDescription('نوع الحماية').setRequired(true).addChoices(...protectionChoices))
    .addStringOption((opt) =>
      opt
        .setName('punishment')
        .setDescription('العقوبة عند المخالفة')
        .setRequired(true)
        .addChoices(...punishmentChoices)
    ),

  async execute(interaction) {
    const protectionName = interaction.options.getString('protection', true);
    const punishment = interaction.options.getString('punishment', true);

    const settings = await getGuildSettings(interaction.guildId);
    const patch = buildPatch(protectionName, settings, punishment);

    if (!patch) {
      return interaction.reply({ ephemeral: true, content: '❌ خيار حماية غير معروف.' });
    }

    await updateGuildSettings(interaction.guildId, patch);
    const label = protectionCatalog[protectionName].label;

    return interaction.reply({
      ephemeral: true,
      content: `✅ تم تفعيل **${label}** وتعيين العقوبة إلى **${punishment}**.`
    });
  }
};
