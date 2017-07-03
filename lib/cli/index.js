const show = require("./show");
const add = require("./add");
const remove = require("./remove");
const { createLogger, LOG_DEBUG, LOG_INFO } = require("../logger");

const config = {
  rootPath: "/Users/greg.poole/Projects/fe-myd-mono/packages",
  logLevel: LOG_DEBUG
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
    break;
  case "add":
    run(add(app, process.cwd(), otherArgs));
    break;
  case "remove":
    run(remove(app, process.cwd(), otherArgs));
    break;
}
