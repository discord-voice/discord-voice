module.exports = {
  execute: async(client, member, oldChannel, newChannel, Voice, VoiceConfig, event) => {
	require('./voiceChannelLeave.js').execute(client, member, oldChannel, Voice, VoiceConfig, event, { isSwitch: true, newChannel: newChannel}); 
  return event.emit('userVoiceSwitch', member, oldChannel, newChannel);
}
 }