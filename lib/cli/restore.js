const difference = require("difference");
const {
  findRealLinks,
  findDescribedLinks,
  filterByName
} = require("../finder");
const { createLinker } = require("../linker");

module.exports = function restore(context) {
  const linker = createLinker(context);

  function lookup(name) {
    return context.findModules(filterByName(name)).then(([found]) => found);
  }

  function eachModulePair(pairs, fn) {
    return pairs.map(([sourceModuleName, destModuleName]) => {
      return Promise.all([
        lookup(sourceModuleName),
        lookup(destModuleName)
      ]).then(([sourceModule, destModule]) => fn(sourceModule, destModule));
    });
  }

  return Promise.all([
    findDescribedLinks(context),
    findRealLinks(context)
  ]).then(([described, real]) => {
    const toCreate = Object.entries(described).reduce(
      (toCreate, [source, dests]) => [
        ...toCreate,
        ...dests.reduce((include, dest) => {
          if (real[source] && real[source].includes(dest)) {
            return include;
          }
          return [...include, [source, dest]];
        }, [])
      ],
      []
    );

    const toRemove = Object.entries(real).reduce(
      (toRemove, [source, dests]) => [
        ...toRemove,
        ...dests.reduce((include, dest) => {
          if (described[source] && described[source].includes(dest)) {
            return include;
          }
          return [...include, [source, dest]];
        }, [])
      ],
      []
    );

    return Promise.all([
      eachModulePair(toRemove, linker.unlink),
      eachModulePair(toCreate, linker.link)
    ]);
  });
};
