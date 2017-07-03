const upath = require("upath");
const assert = require("assert");

function getPackage(app, path) {
  assert(path, "Empty path");
  const { config, logger } = app;
  const packagePath = path.includes("package.json")
    ? path
    : upath.join(path, "package.json");
  logger.debug("finder: Trying to load", packagePath);
  const rawPackage = require(packagePath);
  const { name, version, links = [] } = rawPackage;
  const package = {
    name,
    version,
    links,
    path,
    rawPackage,
    packagePath
  };
  logger.debug("finder: Found package", package);
  return Promise.resolve(package);
}

module.exports = {
  getPackage
};
