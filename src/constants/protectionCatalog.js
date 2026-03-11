const protectionCatalog = {
  'anti-spam': { label: 'Anti Spam', type: 'system', key: 'antiSpam' },
  'anti-link': { label: 'Anti Link', type: 'antiSpam', key: 'blockLinks' },
  'anti-mention': { label: 'Anti Mention', type: 'antiSpam', key: 'mentionLimit', value: 2 },
  'anti-ban': { label: 'Anti Ban', type: 'antiNukeLimit', key: 'banLimit' },
  'anti-kick': { label: 'Anti Kick', type: 'antiNukeLimit', key: 'kickLimit' },
  'anti-bot': { label: 'Anti Bot', type: 'system', key: 'antiBotAdd' },
  'anti-emoji': { label: 'Anti Emoji', type: 'system', key: 'antiEmoji' },
  'anti-sticker': { label: 'Anti Sticker', type: 'system', key: 'antiSticker' },
  'anti-server-update': { label: 'Anti Server Update', type: 'antiNukeLimit', key: 'channelUpdateLimit' },
  'anti-unban': { label: 'Anti Unban', type: 'system', key: 'antiUnban' },
  'anti-administrator': { label: 'Anti Administrator', type: 'system', key: 'antiAdministrator' },
  'anti-channel': { label: 'Anti Channel', type: 'system', key: 'antiChannelAbuse' },
  'anti-role': { label: 'Anti Role', type: 'system', key: 'antiRoleAbuse' },
  'anti-webhook': { label: 'Anti Webhook', type: 'system', key: 'antiWebhook' },
  'enable-all': { label: 'Enable All', type: 'enableAll' }
};

const protectionChoices = Object.keys(protectionCatalog).map((name) => ({ name, value: name }));

module.exports = {
  protectionCatalog,
  protectionChoices
};
