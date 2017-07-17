const chalk = require("chalk");

const LOG_ERROR = 1;
const LOG_WARNING = 2;
const LOG_INFO = 3;
const LOG_DEBUG = 4;
const LOG_TRACE = 5;

function createLogger(context, logContext) {
  function log(level, ...args) {
    if (context.config.logLevel < level) {
      return;
    }

    let prefix = [];
    if (logContext) {
      prefix = [`${logContext.command} > `];
    }

    switch (level) {
      case LOG_ERROR:
        console.error(...prefix, chalk.bold.red("error"), ...args);
        break;
      case LOG_WARNING:
        console.warn(...prefix, chalk.bold.orange("warning"), ...args);
        break;
      case LOG_INFO:
        console.info(...prefix, chalk.bold.blue("info"), ...args);
        break;
      case LOG_DEBUG:
        console.log(...prefix, chalk.bold.green("debug"), ...args);
        break;
    }
  }

  return {
    error: log.bind(null, LOG_ERROR),
    info: log.bind(null, LOG_INFO),
    warn: log.bind(null, LOG_WARNING),
    debug: log.bind(null, LOG_DEBUG),
    prefixed: withLogContext => createLogger(context, withLogContext),
    inspect: obj => log(LOG_INFO, JSON.stringify(obj, null, 2)),
    step: log.bind(null, LOG_INFO)
  };
}

module.exports = {
  LOG_ERROR,
  LOG_WARNING,
  LOG_INFO,
  LOG_DEBUG,
  LOG_TRACE,
  createLogger
};
