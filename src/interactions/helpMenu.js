const { buildHelpEmbed, buildMenu } = require('../commands/general/help');

async function handleHelpMenu(interaction) {
  if (!interaction.isStringSelectMenu()) return false;
  if (interaction.customId !== 'help-menu') return false;

  const selected = interaction.values[0] || 'general';
  await interaction.update({
    embeds: [buildHelpEmbed(selected)],
    components: [buildMenu(selected)]
  });

  return true;
}

module.exports = { handleHelpMenu };
