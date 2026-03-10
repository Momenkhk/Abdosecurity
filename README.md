# AbdoSecurity Bot

بوت أمان ديسكورد احترافي (Discord.js v14 + JSON Storage + Dashboard محلي فقط).

## إعداد المشروع (بدون .env وبدون Mongo)
1) انسخ الملف:
```bash
cp config.json.example config.json
```
2) عدّل `config.json` وضع القيم الحقيقية:
- `token`
- `ownerId`
- `dashPassword`

3) تشغيل:
```bash
npm install
npm start
```

## التخزين
- كل الإعدادات يتم تخزينها بصيغة JSON داخل:
- `data/guild_settings.json`
- يتم إنشاؤه تلقائيًا عند التشغيل.

## مميزات الأمان
- Anti-Nuke قوي عبر Audit Logs (قنوات/رتب/Webhook/Ban/Kick/Bot Add).
- Anti-Spam متقدم (رسائل + منشن + كابيتال + إيموجي + روابط/دعوات).
- Raid Protection مع إغلاق تلقائي وكتم تلقائي.
- Whitelist (Users + Roles + Owner bypass).
- Panic Mode للطوارئ.

## لوحة التحكم
- Local only على `127.0.0.1`.
- دخول OWNER فقط (`ownerId + dashPassword`).
- Rate limit + Lockout + Session TTL.
- تقدر تتحكم في كل إعدادات الحماية من الداشبورد.

## هيكل المشروع
```
src/
  commands/
  events/
  security/
  database/
  dashboard/
  handlers/
  utils/
```
