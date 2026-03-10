const now = () => new Date().toISOString();

module.exports = {
  info: (...args) => console.log(`[INFO ${now()}]`, ...args),
  warn: (...args) => console.warn(`[WARN ${now()}]`, ...args),
  error: (...args) => console.error(`[ERROR ${now()}]`, ...args)
};
