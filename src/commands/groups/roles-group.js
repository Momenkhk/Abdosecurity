const { createCommandGroup } = require('../_shared/createCommandGroup');

module.exports = createCommandGroup({
  name: 'roles',
  description: 'أوامر الرولات',
  adminOnly: true,
  subcommands: ['role', 'myrole', 'dsrole', 'srole', 'addrole', 'autorole', 'daorole', 'allrole', 'removrole', 'here', 'pic', 'live', 'nick', 'check', 'checkvc']
});
