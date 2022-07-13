const contentfulManagement = require("contentful-management");

module.exports = function () {
  const contentfulClient = contentfulManagement.createClient({
    accessToken: "CFPAT-L5sLpOnjUsRLwV5DlczjgqPV0fFLkRM-GOzd5ZJEQjU",
  });

  return contentfulClient
    .getSpace("ycqdsutrl2if")
    .then((space) => space.getEnvironment("master"));
};
