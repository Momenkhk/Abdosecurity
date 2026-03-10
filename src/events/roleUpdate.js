const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'roleUpdate',
  async execute(_oldRole, newRole) {
    await checkAntiNukeByAudit(newRole.guild, AuditLogEvent.RoleUpdate, 'roleUpdateLimit', 'تجاوز حد تعديل الرتب');
  }
};
