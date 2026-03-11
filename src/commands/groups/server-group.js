const { createCommandGroup } = require('../_shared/createCommandGroup');

module.exports = createCommandGroup({
  name: 'serverx',
  description: 'أوامر السيرفر',
  adminOnly: true,
  subcommands: ['guild', 'vip', 'dm', 'say', 'setprefix', 'cmunprefix', 'owners', 'setowner', 'removeowner', 'acomnd', 'listlcomnd', 'removeshortcut']
});
