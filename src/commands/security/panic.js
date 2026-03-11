const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateGuildSettings } = require('../../database/settingsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panic')
    .setDescription('تشغيل أو إيقاف وضع الذعر')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption((opt) => opt.setName('enabled').setDescription('حالة وضع الذعر').setRequired(true)),

  async execute(interaction) {
    const enabled = interaction.options.getBoolean('enabled', true);
    await updateGuildSettings(interaction.guildId, { panicMode: enabled });

    return interaction.reply({
      ephemeral: true,
      content: enabled ? '🚨 تم تفعيل وضع الذعر.' : '✅ تم إيقاف وضع الذعر.'
    });
  }
};
