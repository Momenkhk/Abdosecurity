const { buildHelpEmbed, buildMenu } = require('../commands/general/help');
const config = require('../utils/config');

const directAliasMap = {
  bots: 'protectionx bots',
  help: 'help',
  ping: 'ping',
  status: 'status'
};

function normalizeContent(content) {
  return content.trim().replace(/^\/+/, '').replace(/\s+/g, ' ').toLowerCase();
}

function stripPrefix(content) {
  const lowered = content.toLowerCase();
  for (const prefix of config.prefixes) {
    if (lowered.startsWith(prefix.toLowerCase())) {
      return content.slice(prefix.length).trim();
    }
  }
  return content.trim();
}

function resolveFromCommandList(commands, normalized) {
  if (commands.has(normalized)) return { type: 'root', name: normalized };

  const [root, sub] = normalized.split(' ');
  if (!root || !sub) return null;

  const rootCommand = commands.get(root);
  const rootJson = rootCommand?.data?.toJSON?.();
  const subcommands = (rootJson?.options || []).filter((opt) => opt.type === 1).map((opt) => opt.name);
  if (subcommands.includes(sub)) {
    return { type: 'group', root, sub };
  }

  return null;
}

async function handleTextCommand(message) {
  if (!message.guild || message.author.bot) return false;

  const raw = stripPrefix(message.content || '');
  if (!raw) return false;

  const normalized = normalizeContent(raw);
  const aliasExpanded = directAliasMap[normalized] || normalized;

  if (aliasExpanded === 'help') {
    await message.reply({
      embeds: [buildHelpEmbed('general')],
      components: [buildMenu('general')]
    });
    return true;
  }

  if (aliasExpanded === 'ping') {
    await message.reply(`✅ البوت شغال | Ping: ${message.client.ws.ping}ms`);
    return true;
  }

  if (aliasExpanded === 'status') {
    await message.reply('ℹ️ استخدم `/status` لعرض حالة أنظمة الحماية كاملة.');
    return true;
  }

  const resolved = resolveFromCommandList(message.client.commands, aliasExpanded);
  if (!resolved) return false;

  if (resolved.type === 'group') {
    await message.reply(`✅ تم تنفيذ الأمر: **${resolved.root} ${resolved.sub}**`);
    return true;
  }

  await message.reply(`✅ تم استلام الأمر: **${resolved.name}**. استخدم نسخة السلاش للحصول على كل الخيارات.`);
  return true;
}

module.exports = { handleTextCommand };
