module.exports = {
  execute: async(client, oldState, newState, Voice, VoiceConfig, emit) => {
  const oldMember = oldState.member;
  const newMember = newState.member;
  let emitted = false;
  if(newMember.partial) await newMember.fetch().catch(() => {});

    if (!oldState.channel && newState.channel) {
        require('../handlers/voiceChannelJoin.js').execute(client, newMember, newState.channel, Voice, VoiceConfig, emit);
        emitted = true;
    }
    
    if (oldState.channel && !newState.channel) {
        require('../handlers/voiceChannelLeave.js').execute(client, newMember, oldState.channel, Voice, VoiceConfig, emit); 
        emitted = true;
    }
    
    if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        require('../handlers/voiceChannelSwitch.js').execute(client, newMember, oldState.channel, newState.channel, Voice, VoiceConfig, emit);
        emitted = true;
    }
    
    if (!oldState.mute && newState.mute) {
        const muteType = newState.selfMute ? 'self-muted' : 'server-muted';
        require('../handlers/voiceChannelMute.js').execute(client, newMember, muteType, Voice, VoiceConfig, emit);
        emitted = true;
    }
    
    if (oldState.mute && !newState.mute) {
        const muteType = oldState.selfMute ? 'self-muted' : 'server-muted';
        require('../handlers/voiceChannelUnmute.js').execute(client, newMember, muteType, Voice, VoiceConfig, emit); 
        emitted = true;
    }
    
    if (!oldState.deaf && newState.deaf) {
        const deafType = newState.selfDeaf ? 'self-deafed' : 'server-v';
        require('../handlers/voiceChannelDeaf.js').execute(client, newMember, deafType, Voice, VoiceConfig, emit);
        emitted = true;
    }
    
    if (oldState.deaf && !newState.deaf) {
        const deafType = oldState.selfDeaf ? 'self-deafed' : 'server-v';
        require('../handlers/voiceChannelUndeaf.js').execute(client, newMember, deafType, Voice, VoiceConfig, emit);
        emitted = true;
    }
    
    if (!oldState.streaming && newState.streaming) {
        require('../handlers/voiceStreamingStart.js').execute(client, newMember, newState.channel, Voice, VoiceConfig, emit); // Coming soon in future maybe?
        emitted = true;
    }
    
    if (oldState.streaming && !newState.streaming) {
        require('../handlers/voiceStreamingStop.js').execute(client, newMember, newState.channel, Voice, VoiceConfig, emit);
        emitted = true;
    }
		
    if (!emitted) {
        require('../handlers/unhandledVoiceStateUpdate.js').execute(client, oldState, newState, Voice, VoiceConfig, emit);
    }
	}
}