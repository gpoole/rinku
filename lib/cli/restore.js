const { findOrphans, findAllLinks, filterByName } = require("../finder");
const { createLinker } = require("../linker");

function unpair(object) {
  return Object.entries(object).reduce(
    (pairs, [key, values]) => [
      ...pairs,
      ...values.map(value => {
        return [key, value];
      })
    ],
    []
  );
}

module.exports = function restore(context) {
  const linker = createLinker(context);

  function lookup(name) {
    return context.findModules(filterByName(name)).then(([found]) => found);
  }

  function eachModulePair(fn) {
    return tree => {
      unpair(tree).map(([sourceModuleName, destModuleName]) => {
        return Promise.all([
          lookup(sourceModuleName),
          lookup(destModuleName)
        ]).then(([sourceModule, destModule]) => fn(sourceModule, destModule));
      });
    };
  }

  function ensureLinks() {
    return findAllLinks(context).then(eachModulePair(linker.link));
  }

  function removeOrphans() {
    return findOrphans(context).then(eachModulePair(linker.unlink));
  }

  return Promise.all([
    removeOrphans(context, linker),
    ensureLinks(context, linker)
  ]);
};
