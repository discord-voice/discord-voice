module.exports = {
  /* Info */
  version: require("./package.json").version,
  author: require("./package.json").author,
  license: require("./package.json").license,

  /* Classes */
  VoiceManager: require("./src/Manager"),
};
