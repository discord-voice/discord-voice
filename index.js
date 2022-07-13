/* Info */
exports.version = require('./package.json').version;
exports.author = require('./package.json').author;
exports.license = require('./package.json').license;

/* Classes */
exports.VoiceTimeManager = require('./src/Manager');
exports.Guild = require('./src/Guild');
exports.Config = require('./src/Config');
exports.User = require('./src/User');
exports.Channel = require('./src/Channel');
