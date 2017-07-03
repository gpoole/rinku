const LOG_DEBUG = 4;
const LOG_INFO = 3;
const LOG_WARN = 2;
const LOG_ERROR = 1;
const LOG_OFF = 0;

module.exports = {
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_OFF,
  createLogger(config) {
    return {
      debug: (...args) => {
        if (config.logLevel >= LOG_DEBUG) {
          console.log(...args);
        }
      },
      info: console.log.bind(console),
      output: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    };
  }
};
