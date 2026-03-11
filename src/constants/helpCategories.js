const helpCategories = {
  general: {
    label: 'الأوامر العامة',
    emoji: '💡',
    description: 'شغّل الأوامر من خلال `/general <command>`.',
    commands: ['general avatar', 'general banner', 'general user', 'general top', 'general server', 'general myinv', 'general topinv', 'general mcolors', 'general colors', 'general color', 'general change', 'general circle', 'general aremove', 'general semoji']
  },
  admin: {
    label: 'أوامر الإدارة',
    emoji: '🛠️',
    description: 'شغّل الأوامر من خلال `/admin <command>`.',
    commands: ['admin stickers', 'admin aemoji', 'admin mute', 'admin mymute', 'admin unmute', 'admin prison', 'admin myprison', 'admin unprison', 'admin unvmute', 'admin vmute', 'admin ban', 'admin unban', 'admin unbanal', 'admin allbans', 'admin kick', 'admin setnick', 'admin clear', 'admin move', 'admin moveme', 'admin warn', 'admin warnings', 'admin remove-warn', 'admin timeout']
  },
  roles: {
    label: 'أوامر الرولات',
    emoji: '🎭',
    description: 'شغّل الأوامر من خلال `/roles <command>`.',
    commands: ['roles role', 'roles myrole', 'roles dsrole', 'roles srole', 'roles addrole', 'roles autorole', 'roles daorole', 'roles allrole', 'roles removrole', 'roles here', 'roles pic', 'roles live', 'roles nick', 'roles check', 'roles checkvc']
  },
  chats: {
    label: 'أوامر الشاتات',
    emoji: '💬',
    description: 'شغّل الأوامر من خلال `/chats <command>`.',
    commands: ['chats ochat', 'chats hide', 'chats unhide', 'chats lock', 'chats unlock', 'chats slowmode', 'chats autoreply', 'chats dreply', 'chats mhide', 'chats mshow', 'chats autoline', 'chats unline', 'chats setreact', 'chats unreact', 'chats applay', 'chats disapplay', 'chats setpic', 'chats unpic', 'chats setrchat', 'chats dltrchat', 'chats setrimage', 'chats setrcolor']
  },
  protection: {
    label: 'أوامر الحماية',
    emoji: '🛡️',
    description: 'شغّل الأوامر من خلال `/protectionx <command>` + أوامر `/enable` و`/disable`.',
    commands: ['protectionx bots', 'protectionx word', 'protectionx wordlist', 'protectionx pslist', 'protectionx restbackup', 'protectionx restemoji', 'protectionx block', 'protectionx unblock', 'protectionx setsecurity', 'protectionx wanti', 'protectionx wantilist', 'protectionx setrjoin', 'protectionx antijoin', 'protectionx antibots', 'protectionx antilink', 'protectionx antidelete', 'protectionx anticreate', 'protectionx antispam', 'enable protection:<name> punishment:<type>', 'disable protection:<name>']
  },
  settings: {
    label: 'أوامر الإعدادات',
    emoji: '⚙️',
    description: 'شغّل الأوامر من خلال `/settingsx <command>`.',
    commands: ['settingsx allow', 'settingsx deny', 'settingsx setlog', 'settingsx detlog', 'settingsx imagechat', 'settingsx ctcolors', 'settingsx setclear', 'settingsx wlc', 'settingsx avt', 'settingsx locomnd', 'settingsx setvoice', 'settingsx progress', 'settingsx reset-all', 'settingsx reset', 'settingsx rlevel']
  },
  tickets: {
    label: 'أوامر التذاكر',
    emoji: '🎫',
    description: 'شغّل الأوامر من خلال `/tickets <command>`.',
    commands: ['tickets tipanel', 'tickets ticlog', 'tickets tcsend', 'tickets tcopen', 'tickets setticket', 'tickets tcrole', 'tickets tcrestart', 'tickets ticimage', 'tickets rename', 'tickets close']
  },
  server: {
    label: 'أوامر السيرفر',
    emoji: '🏠',
    description: 'شغّل الأوامر من خلال `/serverx <command>`.',
    commands: ['serverx guild', 'serverx vip', 'serverx dm', 'serverx say', 'serverx setprefix', 'serverx cmunprefix', 'serverx owners', 'serverx setowner', 'serverx removeowner', 'serverx acomnd', 'serverx listlcomnd', 'serverx removeshortcut']
  }
};

const categoryChoices = Object.entries(helpCategories).map(([value, info]) => ({
  name: info.label,
  value
}));

module.exports = {
  helpCategories,
  categoryChoices
};
