const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('فحص سرعة واستجابة البوت'),
  async execute(interaction) {
    await interaction.reply({
      ephemeral: true,
      content: `✅ البوت شغال | Ping: ${interaction.client.ws.ping}ms`
    });
  }
};
