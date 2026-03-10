const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'channelUpdate',
  async execute(_oldChannel, newChannel) {
    await checkAntiNukeByAudit(newChannel.guild, AuditLogEvent.ChannelUpdate, 'channelUpdateLimit', 'تجاوز حد تعديل القنوات');
  }
};
