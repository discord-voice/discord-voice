module.exports = {
  execute: async(client, oldState, newState, Voice, VoiceConfig, event) => {
  return event.emit('unhandledVoiceStateUpdate', oldState, newState);
	}
}