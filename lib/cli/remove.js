const assert = require("assert");
const { getPackage, writePackage } = require("../package");
const { createModuleFinder } = require("../finder");
const { createLinker } = require("../linker");

module.exports = function remove(context, where, modules) {
  assert(where, "remove: Can't figure out the target module to unlink from.");

  if (modules.length === 0) {
    return Promise.reject(new Error("No modules to remove."));
  }

  const { unlink } = createLinker(context);
  const findModules = createModuleFinder(context);

  return Promise.all([
    getPackage(context, where),
    findModules(module => modules.includes(module.name))
  ]).then(([sourceModule, destModules]) => {
    const links = sourceModule.links.filter(link => !modules.includes(link));
    return Promise.all([
      writePackage(
        context,
        Object.assign({}, sourceModule, {
          links: links.length > 0 ? links : undefined
        })
      ),
      ...destModules.map(destModule => unlink(sourceModule, destModule))
    ]);
  });
};
