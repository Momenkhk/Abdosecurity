const { ActivityType } = require('discord.js');
const logger = require('../utils/logger');
const config = require('../utils/config');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`Logged in as ${client.user.tag}`);

    const payload = [...client.commands.values()].map((c) => c.data.toJSON());
    await client.application.commands.set(payload);
    logger.info('Slash commands synced');

    client.user.setPresence({
      status: 'idle',
      activities: [
        {
          name: config.presenceWatching,
          type: ActivityType.Watching
        }
      ]
    });

    logger.info(`Presence set: idle | watching ${config.presenceWatching}`);
  }
};
