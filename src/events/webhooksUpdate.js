const { checkAntiNukeByAudit, AuditLogEvent } = require('../security/protectionEngine');

module.exports = {
  name: 'webhooksUpdate',
  async execute(channel) {
    await checkAntiNukeByAudit(channel.guild, AuditLogEvent.WebhookCreate, 'webhookCreateLimit', 'تجاوز حد إنشاء Webhook');
  }
};
