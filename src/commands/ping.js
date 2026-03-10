const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('فحص').setDescription('فحص حالة البوت'),
  async execute(interaction) {
    await interaction.reply({ content: `✅ البوت يعمل. زمن الاستجابة: ${interaction.client.ws.ping}ms`, ephemeral: true });
  }
};
