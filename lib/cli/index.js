const show = require("./show");
const add = require("./add");
const remove = require("./remove");
const restore = require("./restore");
const { LOG_INFO, createLogger } = require("../logger");
const { createModuleFinder } = require("../finder");

const config = {
  rootPath: "/Users/greg.poole/Projects/fe-myd-mono/packages",
  logLevel: LOG_INFO
};
const logger = createLogger({ config });
const findModules = createModuleFinder({ config, logger });

function run(promise) {
  return promise.catch(err => {
    logger.error(err);
  });
}

const context = { config, logger, findModules };
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
  case "restore":
    run(restore(context));
}
