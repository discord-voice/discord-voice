const mongoose = require("mongoose");
const VoiceSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
	joinTime: { type: Object, default: {} },
  voiceTime: { type: Object, default: {} },
	isBlacklisted: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: new Date() }
});
module.exports = mongoose.model('Voice', VoiceSchema);
