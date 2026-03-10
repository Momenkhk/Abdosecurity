const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'roleCreate',
  async execute(role) {
    await checkAntiNukeByAudit(role.guild, AuditLogEvent.RoleCreate, 'roleCreateLimit', 'تجاوز حد إنشاء الرتب');
  }
};
