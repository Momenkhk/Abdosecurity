const { handleMemberJoinSecurity } = require('../security/protectionEngine');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    await handleMemberJoinSecurity(member);
  }
};
