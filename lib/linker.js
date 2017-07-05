const split = require("split");
const execa = require("execa");
const assert = require("assert");

function createLinker(context) {
  function logOutput(command, exec) {
    const logger = context.logger.prefixed({ command });
    logger.step(command);
    exec.stdout.pipe(split()).on("data", logger.info);
    exec.stderr.pipe(split()).on("data", logger.error);
    return exec;
  }

  return {
    link(sourceModule, destModule) {
      assert(sourceModule.path, "No path for source module");
      assert(destModule.path, "No path for dest module");
      context.logger.debug(
        `Linking from ${sourceModule.path} to ${destModule.path}`
      );
      return logOutput(
        "npm link",
        execa("npm", ["link"], {
          cwd: destModule.path
        })
      ).then(() => {
        return logOutput(
          `npm link ${destModule.name}`,
          execa("npm", ["link", destModule.name], {
            cwd: sourceModule.path
          })
        );
      });
    },
    unlink(sourceModule, destModule) {
      assert(sourceModule.path, "No path for source module");
      assert(destModule.path, "No path for dest module");
      context.logger.debug(
        `Unlinking from ${sourceModule.path} to ${destModule.path}`
      );
      return logOutput(
        "npm unlink",
        execa("npm", ["unlink", destModule.name], {
          cwd: sourceModule.path
        })
      );
    }
  };
}

module.exports = {
  createLinker
};
