const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'roleDelete',
  async execute(role) {
    await checkAntiNukeByAudit(role.guild, AuditLogEvent.RoleDelete, 'roleDeleteLimit', 'تجاوز حد حذف الرتب');
  }
};
