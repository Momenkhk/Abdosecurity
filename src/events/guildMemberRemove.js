const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    await checkAntiNukeByAudit(member.guild, AuditLogEvent.MemberKick, 'kickLimit', 'تجاوز حد الطرد');
  }
};
