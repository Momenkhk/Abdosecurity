const { createCommandGroup } = require('../_shared/createCommandGroup');

module.exports = createCommandGroup({
  name: 'general',
  description: 'الأوامر العامة',
  subcommands: ['avatar', 'banner', 'user', 'top', 'server', 'myinv', 'topinv', 'mcolors', 'colors', 'color', 'change', 'circle', 'aremove', 'semoji']
});
