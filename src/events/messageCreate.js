const { handleMessageSecurity } = require('../security/protectionEngine');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    await handleMessageSecurity(message);
  }
};
