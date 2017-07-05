const { findAllLinks } = require("../finder");

module.exports = function show(context) {
  return findAllLinks(context).then(links => context.logger.inspect(links));
};
