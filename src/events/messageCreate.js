const { handleMessageSecurity } = require('../security/protectionEngine');
const { handleTextCommand } = require('../handlers/textCommandHandler');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    await handleMessageSecurity(message);
    await handleTextCommand(message);
  }
};
