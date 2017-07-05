const fs = require("fs");
const upath = require("upath");
const readdir = require("readdir-enhanced");
const assert = require("assert");
const { getPackage } = require("./package");

function createModuleFinder(context) {
  const { config, logger } = context;
  return (filter = () => true) => {
    assert(config.rootPath, "rootPath config option not set");
    return readdir(config.rootPath, {
      filter: "**/package.json",
      deep: 1
    }).then(packagePaths =>
      Promise.all(
        packagePaths.map(path =>
          getPackage(context, upath.join(config.rootPath, path))
        )
      ).then(packages =>
        packages.filter(package => !!package.name).filter(filter)
      )
    );
  };
}

module.exports = {
  createModuleFinder
};
