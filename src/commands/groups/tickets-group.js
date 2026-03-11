const { createCommandGroup } = require('../_shared/createCommandGroup');

module.exports = createCommandGroup({
  name: 'tickets',
  description: 'أوامر التذاكر',
  adminOnly: true,
  subcommands: ['tipanel', 'ticlog', 'tcsend', 'tcopen', 'setticket', 'tcrole', 'tcrestart', 'ticimage', 'rename', 'close']
});
