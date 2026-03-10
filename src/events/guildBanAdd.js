const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'guildBanAdd',
  async execute(ban) {
    await checkAntiNukeByAudit(ban.guild, AuditLogEvent.MemberBanAdd, 'banLimit', 'تجاوز حد الباند');
  }
};
