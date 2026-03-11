const { createCommandGroup } = require('../_shared/createCommandGroup');

module.exports = createCommandGroup({
  name: 'protectionx',
  description: 'أوامر الحماية الإضافية',
  adminOnly: true,
  subcommands: ['bots', 'word', 'wordlist', 'pslist', 'restbackup', 'restemoji', 'block', 'unblock', 'setsecurity', 'wanti', 'wantilist', 'setrjoin', 'antijoin', 'antibots', 'antilink', 'antidelete', 'anticreate', 'antispam']
});
