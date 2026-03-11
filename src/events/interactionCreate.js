const { handleHelpMenu } = require('../interactions/helpMenu');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (await handleHelpMenu(interaction)) return;

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      const msg = 'حدث خطأ أثناء تنفيذ الأمر.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: msg, ephemeral: true }).catch(() => null);
      } else {
        await interaction.reply({ content: msg, ephemeral: true }).catch(() => null);
      }
    }
  }
};
