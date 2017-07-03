const fs = require("fs");
const assert = require("assert");
const pify = require("pify");
const { getPackage } = require("../package");

function writePackage(package) {
  assert(package.packagePath, "No path for package");
  return pify(fs.writeFile)(
    package.packagePath,
    JSON.stringify(
      Object.assign({}, package.rawPackage, {
        name: package.name,
        version: package.version,
        links: package.links
      }),
      null,
      2
    )
  );
}

module.exports = function add(app, where, modules) {
  assert(where, "add: Can't figure out the package to add a module to.");

  if (modules.length === 0) {
    app.logger.error("No modules to add");
    return;
  }

  return getPackage(app, where).then(package => {
    return writePackage(
      Object.assign({}, package, {
        links: Array.from(new Set([...package.links, ...modules]))
      })
    );
  });
};
