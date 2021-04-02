const voiceChannelJoin = require('./handlers/voiceChannelJoin.js');
const voiceChannelLeave = require('./handlers/voiceChannelLeave.js');
const voiceChannelMute = require('./handlers/voiceChannelMute.js');
const voiceChannelUnmute = require('./handlers/voiceChannelUnmute.js');
const voiceChannelDeaf = require('./handlers/voiceChannelDeaf.js');
const voiceChannelUndeaf = require('./handlers/voiceChannelUndeaf.js');
module.exports = {
handlevoiceChannelJoin: voiceChannelJoin,
handlevoiceChannelLeave: voiceChannelLeave,
handlevoiceChannelMute: voiceChannelMute,
handlevoiceChannelUnmute: voiceChannelUnmute,
handlevoiceChannelDeaf: voiceChannelDeaf,
handlevoiceChannelUndeaf: voiceChannelUndeaf,
}