const mongoose = require("mongoose");

const VoiceSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
	joinTime: { type: Number, default: 0 },
  voiceTime: { type: Number, default: 0 },
	isBlacklisted: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Voice', VoiceSchema);
