const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildSettings, updateGuildSettings } = require('../database/settingsStore');
const config = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('الأمان')
    .setDescription('التحكم في أنظمة الحماية')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) => sub.setName('الحالة').setDescription('عرض حالة أنظمة الأمان'))
    .addSubcommand((sub) =>
      sub
        .setName('ذعر')
        .setDescription('تفعيل/إلغاء وضع الذعر')
        .addBooleanOption((opt) => opt.setName('تشغيل').setDescription('تشغيل وضع الذعر').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('اضف-وايتليست')
        .setDescription('إضافة عضو للقائمة البيضاء')
        .addUserOption((opt) => opt.setName('عضو').setDescription('العضو').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('احذف-وايتليست')
        .setDescription('حذف عضو من القائمة البيضاء')
        .addUserOption((opt) => opt.setName('عضو').setDescription('العضو').setRequired(true))
    ),

  async execute(interaction) {
    const guildId = interaction.guildId;
    const sub = interaction.options.getSubcommand();

    if (sub === 'الحالة') {
      const settings = await getGuildSettings(guildId);
      return interaction.reply({
        ephemeral: true,
        content:
          `🛡️ **حالة الحماية**\n` +
          `- مكافحة التخريب: ${settings.antiNuke.enabled ? 'مفعلة' : 'معطلة'}\n` +
          `- مكافحة السبام: ${settings.systems.antiSpam ? 'مفعلة' : 'معطلة'}\n` +
          `- حماية الرايد: ${settings.systems.antiRaid ? 'مفعلة' : 'معطلة'}\n` +
          `- وضع الذعر: ${settings.panicMode ? 'مفعل' : 'معطل'}\n` +
          `- مالك البوت: <@${config.ownerId}>`
      });
    }

    if (sub === 'ذعر') {
      const enabled = interaction.options.getBoolean('تشغيل', true);
      await updateGuildSettings(guildId, { panicMode: enabled });
      return interaction.reply({ ephemeral: true, content: `🚨 تم ${enabled ? 'تفعيل' : 'إلغاء'} وضع الذعر بنجاح.` });
    }

    if (sub === 'اضف-وايتليست') {
      const user = interaction.options.getUser('عضو', true);
      const settings = await getGuildSettings(guildId);
      const users = Array.from(new Set([...(settings.whitelist.users || []), user.id]));
      await updateGuildSettings(guildId, { whitelist: { ...settings.whitelist, users } });
      return interaction.reply({ ephemeral: true, content: `✅ تمت إضافة ${user} إلى القائمة البيضاء.` });
    }

    if (sub === 'احذف-وايتليست') {
      const user = interaction.options.getUser('عضو', true);
      const settings = await getGuildSettings(guildId);
      const users = (settings.whitelist.users || []).filter((id) => id !== user.id);
      await updateGuildSettings(guildId, { whitelist: { ...settings.whitelist, users } });
      return interaction.reply({ ephemeral: true, content: `✅ تمت إزالة ${user} من القائمة البيضاء.` });
    }
  }
};
