const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildSettings, updateGuildSettings } = require('../../database/settingsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist-add')
    .setDescription('إضافة عضو إلى القائمة البيضاء')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((opt) => opt.setName('user').setDescription('العضو').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const settings = await getGuildSettings(interaction.guildId);
    const users = Array.from(new Set([...(settings.whitelist.users || []), user.id]));

    await updateGuildSettings(interaction.guildId, {
      whitelist: { ...settings.whitelist, users }
    });

    return interaction.reply({ ephemeral: true, content: `✅ تمت إضافة ${user} للقائمة البيضاء.` });
  }
};
