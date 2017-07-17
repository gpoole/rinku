const split = require("split");
const execa = require("execa");
const assert = require("assert");

function createLinker(context) {
  function logOutput(command, exec) {
    context.logger.step(command);
    const logger = context.logger.prefixed({ command });
    exec.stdout.pipe(split()).on("data", logger.debug);
    exec.stderr.pipe(split()).on("data", logger.debug);
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
        `yarn link (in ${destModule.name})`,
        execa("yarn", ["link"], {
          cwd: destModule.path
        })
      ).then(() => {
        return logOutput(
          `yarn link ${destModule.name} (in ${sourceModule.name})`,
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
        `yarn unlink (in ${sourceModule.name})`,
        execa("yarn", ["unlink", destModule.name], {
          cwd: sourceModule.path
        })
      );
    }
  };
}

module.exports = {
  createLinker
};
