module.exports = {
  execute: async(client, member, oldChannel, newChannel, Voice, VoiceConfig, manager) => {
	require('./voiceChannelLeave.js').execute(client, member, oldChannel, Voice, VoiceConfig, manager, { isSwitch: true, newChannel: newChannel}); 
  return manager.emitEvent('userVoiceSwitch', member, oldChannel, newChannel);
}
 }