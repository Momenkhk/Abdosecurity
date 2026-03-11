const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), 'config.json');

if (!fs.existsSync(configPath)) {
  throw new Error('Missing config.json. Copy config.json.example to config.json and fill values.');
}

let raw;
try {
  raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  throw new Error(`Invalid config.json: ${error.message}`);
}

const required = ['token', 'ownerId', 'dashPassword'];
for (const key of required) {
  if (!raw[key] || typeof raw[key] !== 'string') {
    throw new Error(`Missing or invalid required config key: ${key}`);
  }
}

if (!/^\d{17,21}$/.test(raw.ownerId)) {
  throw new Error('ownerId must be a valid Discord snowflake ID');
}

if (raw.dashPassword.length < 12) {
  throw new Error('dashPassword must be at least 12 characters');
}


const prefixes = Array.isArray(raw.prefixes)
  ? raw.prefixes.filter((v) => typeof v === 'string' && v.trim()).map((v) => v.trim()).slice(0, 5)
  : ['!'];

const presenceWatching = typeof raw.presenceWatching === 'string' && raw.presenceWatching.trim()
  ? raw.presenceWatching.trim()
  : 'Security Commands';

const port = Number(raw.port ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('port must be a valid TCP port between 1 and 65535');
}

module.exports = {
  token: raw.token,
  ownerId: raw.ownerId,
  dashPassword: raw.dashPassword,
  port,
  sessionTtlMs: Number(raw.sessionTtlMs ?? 1000 * 60 * 45),
  lockWindowMs: Number(raw.lockWindowMs ?? 1000 * 60 * 15),
  prefixes,
  presenceWatching
};
