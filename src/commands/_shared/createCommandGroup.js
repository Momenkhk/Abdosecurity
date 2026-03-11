const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

function createCommandGroup({ name, description, subcommands, adminOnly = false }) {
  let builder = new SlashCommandBuilder().setName(name).setDescription(description);
  if (adminOnly) {
    builder = builder.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
  }

  for (const sub of subcommands) {
    builder = builder.addSubcommand((option) => option.setName(sub).setDescription(`أمر ${sub}`));
  }

  return {
    data: builder,
    async execute(interaction) {
      const sub = interaction.options.getSubcommand();
      await interaction.reply({
        ephemeral: true,
        content: `✅ تم تنفيذ الأمر: **${name} ${sub}**`
      });
    }
  };
}

module.exports = { createCommandGroup };
