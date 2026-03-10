const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'channelDelete',
  async execute(channel) {
    await checkAntiNukeByAudit(channel.guild, AuditLogEvent.ChannelDelete, 'channelDeleteLimit', 'تجاوز حد حذف القنوات');
  }
};
