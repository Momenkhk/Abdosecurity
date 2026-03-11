const { createCommandGroup } = require('../_shared/createCommandGroup');

module.exports = createCommandGroup({
  name: 'chats',
  description: 'أوامر الشاتات',
  adminOnly: true,
  subcommands: ['ochat', 'hide', 'unhide', 'lock', 'unlock', 'slowmode', 'autoreply', 'dreply', 'mhide', 'mshow', 'autoline', 'unline', 'setreact', 'unreact', 'applay', 'disapplay', 'setpic', 'unpic', 'setrchat', 'dltrchat', 'setrimage', 'setrcolor']
});
