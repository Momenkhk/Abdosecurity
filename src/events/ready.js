const logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`Logged in as ${client.user.tag}`);

    const payload = [...client.commands.values()].map((c) => c.data.toJSON());
    await client.application.commands.set(payload);
    logger.info('Slash commands synced');
  }
};
