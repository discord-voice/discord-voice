module.exports = {
  execute: async(client, oldState, newState, Voice, VoiceConfig, emit) => {
  return emit("unhandledVoiceStateUpdate", oldState, newState);
	}
}