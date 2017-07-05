const pify = require("pify");
const fs = pify(require("fs"));
const upath = require("upath");
const readdir = require("readdir-enhanced");
const assert = require("assert");
const { getPackage } = require("./package");

function createModuleFinder(context) {
  const { config, logger } = context;
  assert(config.rootPath, "rootPath config option not set");

  let modules;
  function getModules() {
    if (!modules) {
      modules = readdir(config.rootPath, {
        filter: "**/package.json",
        deep: 1
      })
        .then(packagePaths =>
          Promise.all(
            packagePaths.map(path =>
              getPackage(context, upath.join(config.rootPath, path))
            )
          )
        )
        .then(packages => packages.filter(package => !!package.name));
    }
    return modules;
  }

  return (filter = () => true) => {
    return getModules().then(packages => packages.filter(filter));
  };
}

function filterByName(name) {
  const names = Array.isArray(name) ? name : [name];
  return package => names.includes(package.name);
}

function filterByPath(path) {
  const paths = Array.isArray(path) ? path : [path];
  return package => paths.includes(package.path);
}

function findDescribedLinks(context) {
  return context
    .findModules(package => package.links.length > 0)
    .then(foundModules =>
      foundModules.reduce(
        (packagesWithLinks, package) =>
          Object.assign({}, packagesWithLinks, {
            [package.name]: package.links
          }),
        {}
      )
    );
}

function findRealLinks(context) {
  const { logger, findModules, config } = context;
  assert(config.rootPath, "rootPath config option not set");
  return readdir(config.rootPath, {
    filter: stats =>
      stats.path.includes("node_module") &&
      !stats.path.includes(".bin") &&
      stats.isSymbolicLink(),
    deep: 3
  })
    .then(linkPaths =>
      Promise.all(
        linkPaths.map(
          linkPath =>
            Promise.all([
              // look up source module
              findModules(
                filterByPath(
                  upath.join(
                    config.rootPath,
                    linkPath.replace(/\/node_modules\/.*$/, "")
                  )
                )
              ),
              // look up linked module
              fs
                .realpath(upath.join(config.rootPath, linkPath))
                .then(realPath => findModules(filterByPath(realPath)))
            ]).then(([[source], [dest]]) => [source, dest]) // findModules always returns an array
        )
        // remove links that didn't actually resolve to a module
      ).then(pairs => pairs.filter(([, dest]) => dest))
    )
    .then(foundLinks =>
      foundLinks.reduce((found, [source, dest]) => {
        return Object.assign({}, found, {
          [source.name]: [...(found[source.name] || []), dest.name]
        });
      }, {})
    );
}

module.exports = {
  createModuleFinder,
  filterByName,
  findDescribedLinks,
  findRealLinks
};
