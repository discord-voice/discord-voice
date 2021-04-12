const mongoose = require("mongoose");

const VoiceConfigSchema = new mongoose.Schema({
	guildID: { type: String },
  trackbots: { type: Boolean, default: false },
  trackallchannels: { type: Boolean, default: true },
	userlimit: { type: Number, default: 0 },
  channelID: { type: Array, default: [] },
	trackMute: { type: Boolean, default: true },
	trackDeaf: { type: Boolean, default: true },
	isEnabled: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: new Date() }
});

module.exports = mongoose.model('VoiceConfig', VoiceConfigSchema);
