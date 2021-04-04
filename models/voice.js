const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')
const VoiceSchema = new mongoose.Schema({
  userID: { type: String, unique: true },
  guildID: { type: String },
	joinTime: { type: Object, default: {} },
  voiceTime: { type: Object, default: {} },
	isBlacklisted: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: new Date() }
});
VoiceSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Voice', VoiceSchema);
