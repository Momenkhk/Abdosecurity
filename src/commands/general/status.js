const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGuildSettings } = require('../../database/settingsStore');

const boolText = (value) => (value ? '✅ مفعّل' : '❌ معطّل');

module.exports = {
  data: new SlashCommandBuilder().setName('status').setDescription('عرض حالة الحماية الحالية بالسيرفر'),

  async execute(interaction) {
    const settings = await getGuildSettings(interaction.guildId);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('لوحة حالة الحماية')
      .addFields(
        {
          name: 'الأنظمة الأساسية',
          value: [
            `• Anti Nuke: ${boolText(settings.systems.antiNuke)}`,
            `• Anti Spam: ${boolText(settings.systems.antiSpam)}`,
            `• Anti Raid: ${boolText(settings.systems.antiRaid)}`,
            `• Anti Bot Add: ${boolText(settings.systems.antiBotAdd)}`
          ].join('\n')
        },
        {
          name: 'الحماية المتقدمة',
          value: [
            `• Anti Webhook: ${boolText(settings.systems.antiWebhook)}`,
            `• Anti Role Abuse: ${boolText(settings.systems.antiRoleAbuse)}`,
            `• Anti Channel Abuse: ${boolText(settings.systems.antiChannelAbuse)}`,
            `• Panic Mode: ${boolText(settings.panicMode)}`
          ].join('\n')
        },
        {
          name: 'الإجراء عند المخالفة',
          value: `العقوبة الحالية: **${settings.antiNuke.punishment}**`
        }
      )
      .setFooter({ text: `Guild ID: ${interaction.guildId}` });

    await interaction.reply({ ephemeral: true, embeds: [embed] });
  }
};
