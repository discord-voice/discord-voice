module.exports = {
  execute: async(client, member, oldChannel, newChannel, Voice, VoiceConfig, emit) => {
	require('./voiceChannelLeave.js').execute(client, member, oldChannel, Voice, VoiceConfig, emit, { isSwitch: true, newChannel: newChannel}); 
  return emit('userVoiceSwitch', member, oldChannel, newChannel);
}
 }