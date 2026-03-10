const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const config = require('./utils/config');
const logger = require('./utils/logger');
const { ensureStore } = require('./database/jsonStore');
const { registerCommands } = require('./handlers/commandHandler');
const { registerEvents } = require('./handlers/eventHandler');
const { createDashboardServer } = require('./dashboard/server');

async function bootstrap() {
  ensureStore();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
  });

  client.commands = new Collection();
  registerCommands(client);
  registerEvents(client);

  const app = createDashboardServer(client);
  app.listen(config.port, '127.0.0.1', () => {
    logger.info(`Dashboard running locally at http://127.0.0.1:${config.port}`);
  });

  await client.login(config.token);
}

bootstrap().catch((error) => {
  logger.error('Fatal startup error:', error);
  process.exit(1);
});
