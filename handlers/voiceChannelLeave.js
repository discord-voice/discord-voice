module.exports = {
  execute: async(client, member, channel, Voice, VoiceConfig, emit, ops) => {
		if(!ops) ops = {isSwitch: false}
    let config;
    config = await VoiceConfig.findOne({
      guildID: member.guild.id
    });
    if (!config) {
      config = {
        guildID: member.guild.id,
        trackbots: false,
        trackallchannels: true,
        userlimit: 0,
        channelID: [],
        trackMute: true,
        trackDeaf: true,
        isEnabled: true,
				lastUpdated: new Date()
      }
			await VoiceConfig.create(config).catch(e => console.log(`Failed to save config: ${e}`));
    }
    if (!config.isEnabled) return;
    if (!config.trackbots) if (member.bot) return;
    const user = await Voice.findOne({
      userID: member.user.id,
      guildID: member.guild.id
    });
    if (!config.trackallchannels) {
      if (config.channelID.includes(channel.id)) {
        if (user) {
          if (user.isBlacklisted) return;
					let jointime = user.joinTime[channel.id]
					if(!jointime) jointime = 0
					let voicetime = user.voiceTime[channel.id]
					if(!voicetime) voicetime = 0
          if (jointime == 0) return;
          let time = (Date.now() - jointime)
          let finaltime = +time + +voicetime
          voicetime = finaltime
          jointime = 0
					user.voiceTime[channel.id] = voicetime
					user.joinTime[channel.id] = jointime
					let userobj = user.voiceTime
					delete userobj.total;
					let total = Object.values(userobj).reduce((a, b) => a + b, 0)
					user.voiceTime['total'] = total
          user.markModified('joinTime')
					user.markModified('voiceTime')
          await user.save().catch(e => console.log(`Failed to save user voice time: ${e}`));
          let data = {}
				  data.user = user
				  data.config = config
				  emit("userVoiceLeave", data, member, channel);
					if(ops.isSwitch){
					require('./voiceChannelJoin.js').execute(client, member, ops.newChannel, Voice, VoiceConfig, emit); 
					return user;
					}
					return user;
        } else return;
      }
    }
    if (config.trackallchannels) {
      if (user) {
          if (user.isBlacklisted) return;
					let jointime = user.joinTime[channel.id]
					if(!jointime) jointime = 0
					let voicetime = user.voiceTime[channel.id]
					if(!voicetime) voicetime = 0
          if (jointime == 0) return;
          let time = (Date.now() - jointime)
          let finaltime = +time + +voicetime
          voicetime = finaltime
          jointime = 0
					user.voiceTime[channel.id] = voicetime
					user.joinTime[channel.id] = jointime
					let userobj = user.voiceTime
					delete userobj.total;
					let total = Object.values(userobj).reduce((a, b) => a + b, 0)
					user.voiceTime['total'] = total
          user.markModified('joinTime')
					user.markModified('voiceTime')
          await user.save().catch(e => console.log(`Failed to save user voice time: ${e}`));
          let data = {}
				  data.user = user
				  data.config = config
				  emit("userVoiceLeave", data, member, channel);
					if(ops.isSwitch){
					require("./voiceChannelJoin.js").execute(
            client,
            member,
            ops.newChannel,
            Voice,
            VoiceConfig,
            emit
          ); 
					return user;
					}
					return user;
      } else return;
    }
}
 }