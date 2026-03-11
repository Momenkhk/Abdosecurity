const { createCommandGroup } = require('../_shared/createCommandGroup');

module.exports = createCommandGroup({
  name: 'settingsx',
  description: 'أوامر الإعدادات الإضافية',
  adminOnly: true,
  subcommands: ['allow', 'deny', 'setlog', 'detlog', 'imagechat', 'ctcolors', 'setclear', 'wlc', 'avt', 'locomnd', 'setvoice', 'progress', 'reset-all', 'reset', 'rlevel']
});
