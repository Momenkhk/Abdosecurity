const fs = require('fs');
const path = require('path');

function readCommandFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readCommandFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

function registerCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const files = readCommandFiles(commandsPath);

  for (const filePath of files) {
    const command = require(filePath);
    if (!command?.data?.name || typeof command.execute !== 'function') {
      continue;
    }

    client.commands.set(command.data.name, command);
  }
}

module.exports = { registerCommands };
