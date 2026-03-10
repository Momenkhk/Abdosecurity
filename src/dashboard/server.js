const path = require('path');
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { getGuildSettings, updateGuildSettings, sanitizeSettingsPatch } = require('../database/settingsStore');
const config = require('../utils/config');

const sessions = new Map();
const attemptState = {
  count: 0,
  lockUntil: 0
};

function isLocalRequest(ip = '') {
  return ip.includes('127.0.0.1') || ip.includes('::1') || ip === '::ffff:127.0.0.1';
}

function safeEqual(a = '', b = '') {
  const aBuf = Buffer.from(String(a));
  const bBuf = Buffer.from(String(b));
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function cleanupSessions() {
  const now = Date.now();
  for (const [sid, value] of sessions.entries()) {
    if (now - value.createdAt > config.sessionTtlMs) {
      sessions.delete(sid);
    }
  }
}

function authMiddleware(req, res, next) {
  if (!isLocalRequest(req.ip)) return res.status(403).send('Forbidden');
  cleanupSessions();
  const sid = req.headers['x-session-id'];
  if (!sid || !sessions.has(sid)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

function createDashboardServer(client) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', false);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(morgan('dev'));
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '20kb' }));

  app.use((req, res, next) => {
    if (!isLocalRequest(req.ip)) {
      return res.status(403).send('Dashboard local access only');
    }
    return next();
  });

  app.use(
    '/auth/login',
    rateLimit({
      windowMs: 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use('/static', express.static(path.join(__dirname, 'public')));

  app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  });

  app.get('/dashboard', (_req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
  });

  app.post('/auth/login', async (req, res) => {
    if (attemptState.lockUntil > Date.now()) {
      return res.status(423).json({ error: 'تم قفل لوحة التحكم مؤقتًا بسبب محاولات فاشلة كثيرة' });
    }

    const ownerId = String(req.body.ownerId || '').trim();
    const password = String(req.body.password || '');

    const passOk = safeEqual(password, config.dashPassword);
    const ownerOk = safeEqual(ownerId, config.ownerId);

    if (!passOk || !ownerOk) {
      attemptState.count += 1;
      if (attemptState.count >= 5) {
        attemptState.lockUntil = Date.now() + config.lockWindowMs;
        attemptState.count = 0;
      }
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    attemptState.count = 0;
    const sid = crypto.randomUUID();
    sessions.set(sid, { createdAt: Date.now(), ownerId });

    return res.json({ ok: true, sid, ttlMs: config.sessionTtlMs });
  });

  app.post('/auth/logout', authMiddleware, async (req, res) => {
    const sid = req.headers['x-session-id'];
    sessions.delete(sid);
    res.json({ ok: true });
  });

  app.get('/api/overview', authMiddleware, async (_req, res) => {
    const guild = client.guilds.cache.first();
    if (!guild) return res.json({ botOnline: !!client.user, guild: null });

    const settings = await getGuildSettings(guild.id);
    const members = await guild.members.fetch({ withPresences: false }).catch(() => null);

    res.json({
      guild: { id: guild.id, name: guild.name },
      botOnline: !!client.user,
      totalMembers: members?.size || guild.memberCount,
      protections: settings.systems,
      antiNuke: settings.antiNuke,
      panicMode: settings.panicMode,
      recentAlerts: [
        'لا توجد تهديدات حرجة حاليًا',
        'حالة الحماية مستقرة',
        'أنظمة المراقبة تعمل بشكل طبيعي'
      ]
    });
  });

  app.get('/api/settings', authMiddleware, async (_req, res) => {
    const guild = client.guilds.cache.first();
    if (!guild) return res.status(404).json({ error: 'لا يوجد سيرفر مرتبط' });
    const settings = await getGuildSettings(guild.id);
    res.json(settings);
  });

  app.post('/api/settings', authMiddleware, async (req, res) => {
    const guild = client.guilds.cache.first();
    if (!guild) return res.status(404).json({ error: 'لا يوجد سيرفر مرتبط' });

    const safePatch = sanitizeSettingsPatch(req.body);
    const updated = await updateGuildSettings(guild.id, safePatch);
    res.json({ ok: true, settings: updated });
  });

  return app;
}

module.exports = { createDashboardServer };
