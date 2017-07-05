function createLogger(context, logContext) {
  return {
    error: console.error.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    debug: console.log.bind(console),
    prefixed: withLogContext => createLogger(context, logContext),
    inspect: obj => console.log(JSON.stringify(obj, null, 2)),
    step: console.log.bind(console)
  };
}

module.exports = createLogger;
