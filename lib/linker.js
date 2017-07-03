const execa = require("execa");
const assert = require("assert");

function createLinker(app) {
  return {
    link(sourceModule, destModule) {
      assert(sourceModule.path, "No path for source module");
      assert(destModule.path, "No path for dest module");
      app.logger.debug(
        `Linking from ${sourceModule.path} to ${destModule.path}`
      );
      return execa("npm", ["link"], {
        cwd: destModule.path
      }).then(() => {
        return execa("npm", ["link", destModule.name], {
          cwd: sourceModule.path
        });
      });
    },
    unlink(sourceModule, destModule) {
      assert(sourceModule.path, "No path for source module");
      assert(destModule.path, "No path for dest module");
      app.logger.debug(
        `Unlinking from ${sourceModule.path} to ${destModule.path}`
      );
      return execa("npm", ["unlink", destModule.name], {
        cwd: sourceModule.path
      });
    }
  };
}

module.exports = {
  createLinker
};
