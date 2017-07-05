const pino = require("pino");

function createLogger(context, logger = pino()) {
  return {
    error: logger.error.bind(logger),
    info: logger.info.bind(logger),
    debug: logger.debug.bind(logger),
    warn: logger.warn.bind(logger),
    warn: logger.debug.bind(logger),
    warn: logger.trace.bind(logger),
    fatal: logger.fatal.bind(logger),
    prefixed: logContext => createLogger(context, logger.child({ logContext })),
    inspect: (...args) => logger.info(...args, { inspect: true })
  };
}

module.exports = createLogger;
