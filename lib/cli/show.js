const { createModuleFinder } = require("../finder");

function findAllLinks(app) {
  const findModules = createModuleFinder(app);
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

module.exports = function show(app) {
  findAllLinks(app).then(links => console.log(JSON.stringify(links, null, 2)));
};
