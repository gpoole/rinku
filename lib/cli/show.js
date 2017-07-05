const { createModuleFinder } = require("../finder");

function findAllLinks(context) {
  const findModules = createModuleFinder(context);
  return findModules(package => package.links.length > 0).then(foundModules =>
    foundModules.reduce(
      (packagesWithLinks, package) =>
        Object.assign({}, packagesWithLinks, {
          [package.name]: package.links
        }),
      {}
    )
  );
}

module.exports = function show(context) {
  findAllLinks(context).then(links => console.log(JSON.stringify(links, null, 2)));
};
