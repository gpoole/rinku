const show = require("./show");
const add = require("./add");
const { createLogger, LOG_DEBUG, LOG_INFO } = require("../logger");

const config = {
  rootPath: "/Users/greg.poole/Projects/fe-myd-mono/packages",
  logLevel: LOG_INFO
};

const app = {
  config,
  logger: createLogger(config)
};

function run(promise) {
  return promise.catch(err => {
    app.logger.error(err);
  });
}

const [, , command, ...otherArgs] = process.argv;
switch (command) {
  case "show":
    run(show(app));
  case "add":
    run(add(app, process.cwd(), otherArgs));
}
