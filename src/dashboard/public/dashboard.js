const sid = localStorage.getItem('sid');
if (!sid) location.href = '/';

const labels = {
  antiNuke: 'مكافحة التخريب',
  antiSpam: 'مكافحة السبام',
  antiRaid: 'حماية الرايد',
  antiBotAdd: 'منع إضافة البوتات',
  antiWebhook: 'منع إساءة Webhook',
  antiRoleAbuse: 'منع إساءة الرتب',
  antiChannelAbuse: 'منع إساءة القنوات',
  antiPermissionAbuse: 'منع إساءة الصلاحيات'
};

let settingsState = null;

async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sid,
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.removeItem('sid');
    location.href = '/';
    return null;
  }

  return res.json();
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function fieldTemplate(path, label, value, type = 'number') {
  const v = value ?? '';
  return `<div class="limit"><label>${label}</label><input class="field" data-path="${path}" type="${type}" value="${escapeHtml(v)}" /></div>`;
}

function toggleTemplate(path, label, enabled) {
  return `<div class="toggle-item"><span>${label}</span><input class="field" data-path="${path}" type="checkbox" ${enabled ? 'checked' : ''}></div>`;
}

function setPath(obj, path, value) {
  const parts = path.split('.');
  let ref = obj;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!ref[parts[i]] || typeof ref[parts[i]] !== 'object') ref[parts[i]] = {};
    ref = ref[parts[i]];
  }
  ref[parts.at(-1)] = value;
}

function renderAll(overview, settings) {
  settingsState = structuredClone(settings);

  document.getElementById('securityStatus').textContent = settingsState.panicMode ? 'وضع ذعر مفعل' : 'مستقر';
  document.getElementById('totalMembers').textContent = overview.totalMembers || '0';
  document.getElementById('botStatus').textContent = overview.botOnline ? 'متصل' : 'غير متصل';
  document.getElementById('enabledProtections').textContent = Object.values(settingsState.systems).filter(Boolean).length;
  document.getElementById('alerts').innerHTML = overview.recentAlerts.map((a) => `<li>${escapeHtml(a)}</li>`).join('');

  document.getElementById('systemsToggles').innerHTML = Object.entries(settingsState.systems)
    .map(([k, v]) => toggleTemplate(`systems.${k}`, labels[k] || k, v))
    .join('');

  document.getElementById('nukeControls').innerHTML = `
    ${toggleTemplate('antiNuke.enabled', 'تفعيل Anti-Nuke', settingsState.antiNuke.enabled)}
    ${fieldTemplate('antiNuke.channelCreateLimit', 'حد إنشاء القنوات', settingsState.antiNuke.channelCreateLimit)}
    ${fieldTemplate('antiNuke.channelDeleteLimit', 'حد حذف القنوات', settingsState.antiNuke.channelDeleteLimit)}
    ${fieldTemplate('antiNuke.channelUpdateLimit', 'حد تعديل القنوات', settingsState.antiNuke.channelUpdateLimit)}
    ${fieldTemplate('antiNuke.roleCreateLimit', 'حد إنشاء الرتب', settingsState.antiNuke.roleCreateLimit)}
    ${fieldTemplate('antiNuke.roleDeleteLimit', 'حد حذف الرتب', settingsState.antiNuke.roleDeleteLimit)}
    ${fieldTemplate('antiNuke.roleUpdateLimit', 'حد تعديل الرتب', settingsState.antiNuke.roleUpdateLimit)}
    ${fieldTemplate('antiNuke.banLimit', 'حد الباند', settingsState.antiNuke.banLimit)}
    ${fieldTemplate('antiNuke.kickLimit', 'حد الطرد', settingsState.antiNuke.kickLimit)}
    ${fieldTemplate('antiNuke.webhookCreateLimit', 'حد إنشاء Webhook', settingsState.antiNuke.webhookCreateLimit)}
    ${fieldTemplate('antiNuke.botAddLimit', 'حد إضافة بوتات', settingsState.antiNuke.botAddLimit)}
    ${fieldTemplate('antiNuke.punishment', 'العقوبة (ban/kick/remove_roles/timeout)', settingsState.antiNuke.punishment, 'text')}
  `;

  document.getElementById('spamControls').innerHTML = `
    ${fieldTemplate('antiSpam.messageLimit', 'حد الرسائل', settingsState.antiSpam.messageLimit)}
    ${fieldTemplate('antiSpam.messageWindowMs', 'نافذة الرسائل بالمللي', settingsState.antiSpam.messageWindowMs)}
    ${fieldTemplate('antiSpam.mentionLimit', 'حد المنشن', settingsState.antiSpam.mentionLimit)}
    ${fieldTemplate('antiSpam.capsRatioLimit', 'حد الكابيتال (0-1)', settingsState.antiSpam.capsRatioLimit, 'number')}
    ${fieldTemplate('antiSpam.emojiLimit', 'حد الإيموجي', settingsState.antiSpam.emojiLimit)}
    ${toggleTemplate('antiSpam.blockInvites', 'منع الدعوات', settingsState.antiSpam.blockInvites)}
    ${toggleTemplate('antiSpam.blockLinks', 'منع الروابط', settingsState.antiSpam.blockLinks)}
  `;

  document.getElementById('raidControls').innerHTML = `
    ${toggleTemplate('raidProtection.autoLockdown', 'إغلاق تلقائي', settingsState.raidProtection.autoLockdown)}
    ${fieldTemplate('raidProtection.joinRateLimit', 'حد الانضمام', settingsState.raidProtection.joinRateLimit)}
    ${fieldTemplate('raidProtection.suspiciousAccountDays', 'عمر الحساب المشبوه بالأيام', settingsState.raidProtection.suspiciousAccountDays)}
    ${toggleTemplate('raidProtection.autoSlowmode', 'Slowmode تلقائي', settingsState.raidProtection.autoSlowmode)}
    ${toggleTemplate('raidProtection.autoMute', 'Mute تلقائي', settingsState.raidProtection.autoMute)}
  `;

  document.getElementById('verificationControls').innerHTML = `
    ${toggleTemplate('verification.buttonEnabled', 'تفعيل زر التحقق', settingsState.verification.buttonEnabled)}
    ${toggleTemplate('verification.captchaEnabled', 'تفعيل Captcha', settingsState.verification.captchaEnabled)}
    ${fieldTemplate('verification.minAccountAgeDays', 'أقل عمر حساب (يوم)', settingsState.verification.minAccountAgeDays)}
    ${toggleTemplate('verification.antiAltDetection', 'كشف الحسابات البديلة', settingsState.verification.antiAltDetection)}
  `;

  document.getElementById('logsControls').innerHTML = `
    ${fieldTemplate('logs.member', 'Member Logs Channel ID', settingsState.logs.member, 'text')}
    ${fieldTemplate('logs.channel', 'Channel Logs Channel ID', settingsState.logs.channel, 'text')}
    ${fieldTemplate('logs.role', 'Role Logs Channel ID', settingsState.logs.role, 'text')}
    ${fieldTemplate('logs.security', 'Security Logs Channel ID', settingsState.logs.security, 'text')}
    ${fieldTemplate('logs.message', 'Message Logs Channel ID', settingsState.logs.message, 'text')}
  `;

  document.getElementById('whitelistControls').innerHTML = `
    ${toggleTemplate('whitelist.ownerBypass', 'Owner Bypass', settingsState.whitelist.ownerBypass)}
    ${fieldTemplate('whitelist.users', 'User IDs (comma separated)', (settingsState.whitelist.users || []).join(','), 'text')}
    ${fieldTemplate('whitelist.roles', 'Role IDs (comma separated)', (settingsState.whitelist.roles || []).join(','), 'text')}
    ${toggleTemplate('backup.autoBackup', 'تفعيل النسخ الاحتياطي التلقائي', settingsState.backup.autoBackup)}
  `;

  document.querySelectorAll('.field').forEach((el) => {
    el.addEventListener('change', () => {
      const path = el.dataset.path;
      let value;
      if (el.type === 'checkbox') value = el.checked;
      else if (path === 'whitelist.users' || path === 'whitelist.roles') {
        value = el.value.split(',').map((v) => v.trim()).filter(Boolean);
      } else if (el.type === 'number') {
        value = Number(el.value);
      } else {
        value = el.value.trim();
      }
      setPath(settingsState, path, value);
    });
  });
}

async function loadData() {
  const overview = await api('/api/overview');
  const settings = await api('/api/settings');
  if (!overview || !settings) return;
  renderAll(overview, settings);
}

(async function init() {
  await loadData();

  document.getElementById('saveAll').addEventListener('click', async () => {
    const msg = document.getElementById('saveMessage');
    const result = await api('/api/settings', { method: 'POST', body: JSON.stringify(settingsState) });
    msg.textContent = result?.ok ? '✅ تم حفظ كل الإعدادات بنجاح' : '❌ فشل حفظ الإعدادات';
  });

  document.getElementById('reloadAll').addEventListener('click', loadData);

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await api('/auth/logout', { method: 'POST' });
    localStorage.removeItem('sid');
    location.href = '/';
  });

  document.querySelectorAll('.quick-actions button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (btn.dataset.action === 'panic') {
        settingsState.panicMode = !settingsState.panicMode;
        await api('/api/settings', { method: 'POST', body: JSON.stringify({ panicMode: settingsState.panicMode }) });
        document.getElementById('securityStatus').textContent = settingsState.panicMode ? 'وضع ذعر مفعل' : 'مستقر';
      }
      if (btn.dataset.action === 'invites') {
        settingsState.antiSpam.blockInvites = true;
        await api('/api/settings', { method: 'POST', body: JSON.stringify({ antiSpam: settingsState.antiSpam }) });
      }
    });
  });
})();
