const { findDescribedLinks } = require("../finder");

module.exports = function show(context) {
  return findDescribedLinks(context).then(links => context.logger.inspect(links));
};
