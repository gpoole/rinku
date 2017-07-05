const fs = require("fs");
const pify = require("pify");
const upath = require("upath");
const assert = require("assert");

function writePackage(context, package) {
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

function getPackage(context, path) {
  assert(path, "Empty path");
  const { config, logger } = context;
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
    path: upath.dirname(packagePath),
    rawPackage,
    packagePath
  };
  logger.debug("finder: Found package", package.name);
  return Promise.resolve(package);
}

module.exports = {
  getPackage,
  writePackage
};
