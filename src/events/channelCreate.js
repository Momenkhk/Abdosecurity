const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'channelCreate',
  async execute(channel) {
    await checkAntiNukeByAudit(channel.guild, AuditLogEvent.ChannelCreate, 'channelCreateLimit', 'تجاوز حد إنشاء القنوات');
  }
};
