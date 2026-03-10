const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'guild_settings.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ guilds: {} }, null, 2), 'utf8');
  }
}

function readStore() {
  ensureStore();
  const raw = fs.readFileSync(dataFile, 'utf8');
  const parsed = JSON.parse(raw || '{}');
  if (!parsed.guilds || typeof parsed.guilds !== 'object') return { guilds: {} };
  return parsed;
}

function writeStore(payload) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(payload, null, 2), 'utf8');
}

module.exports = {
  ensureStore,
  readStore,
  writeStore,
  dataFile
};
