const { createCommandGroup } = require('../_shared/createCommandGroup');

module.exports = createCommandGroup({
  name: 'admin',
  description: 'أوامر الإدارة',
  adminOnly: true,
  subcommands: ['stickers', 'aemoji', 'mute', 'mymute', 'unmute', 'prison', 'myprison', 'unprison', 'unvmute', 'vmute', 'ban', 'unban', 'unbanal', 'allbans', 'kick', 'setnick', 'clear', 'move', 'moveme', 'warn', 'warnings', 'remove-warn', 'timeout']
});
