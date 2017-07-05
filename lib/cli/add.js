const assert = require("assert");
const { getPackage, writePackage } = require("../package");
const { filterByName } = require("../finder");
const { createLinker } = require("../linker");

module.exports = function add(context, where, modules) {
  assert(where, "add: Can't figure out the target module to link to.");

  if (modules.length === 0) {
    return Promise.reject(new Error("No modules to add"));
  }

  const { link } = createLinker(context);
  const { findModules } = context;

  return Promise.all([
    getPackage(context, where),
    findModules(filterByName(modules))
  ]).then(([sourceModule, destModules]) => {
    return Promise.all([
      writePackage(
        context,
        Object.assign({}, sourceModule, {
          links: Array.from(new Set([...sourceModule.links, ...modules]))
        })
      ),
      ...destModules.map(destModule => link(sourceModule, destModule))
    ]);
  });
};
