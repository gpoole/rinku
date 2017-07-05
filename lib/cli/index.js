const show = require("./show");
const add = require("./add");
const remove = require("./remove");
const createLogger = require("../logger");

const config = {
  rootPath: "/Users/greg.poole/Projects/fe-myd-mono/packages"
};

const context = {
  config,
  logger: createLogger(config)
};

function run(promise) {
  return promise.catch(err => {
    context.logger.error(err);
  });
}

const [, , command, ...otherArgs] = process.argv;
switch (command) {
  case "show":
    run(show(context));
    break;
  case "add":
    run(add(context, process.cwd(), otherArgs));
    break;
  case "remove":
    run(remove(context, process.cwd(), otherArgs));
    break;
}
