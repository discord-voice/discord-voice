module.exports = {
  execute: async(client, member, muteType, Voice, VoiceConfig, emit) => {
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
    if (!config.trackMute) {
      let user = await Voice.findOne({
        userID: member.user.id,
        guildID: member.guild.id
      });
      if (!config.trackallchannels) {
        if (config.channelID.includes(member.voice.channel.id)) {
					if(user){
          if (user.isBlacklisted) return;
					let jointime = user.joinTime[member.voice.channel.id]
					if(!jointime) jointime = 0
					let voicetime = user.voiceTime[member.voice.channel.id]
					if(!voicetime) voicetime = 0
          if (jointime == 0) return;
          let time = (Date.now() - jointime)
          let finaltime = +time + +voicetime
          voicetime = finaltime
          jointime = 0
					user.voiceTime[member.voice.channel.id] = voicetime
					user.joinTime[member.voice.channel.id] = jointime
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
					emit('userVoiceMute', data, member, member.voice.channel, muteType)
					return user;
					} else return;
        }
      }
      if (config.trackallchannels) {
				  if(user){
          if (user.isBlacklisted) return;
					let jointime = user.joinTime[member.voice.channel.id]
					if(!jointime) jointime = 0
					let voicetime = user.voiceTime[member.voice.channel.id]
					if(!voicetime) voicetime = 0
          if (jointime == 0) return;
          let time = (Date.now() - jointime)
          let finaltime = +time + +voicetime
          voicetime = finaltime
          jointime = 0
					user.voiceTime[member.voice.channel.id] = voicetime
					user.joinTime[member.voice.channel.id] = jointime
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
					emit('userVoiceMute', data, member, member.voice.channel, muteType)
					return user;
					} else return;
      }
    } else {
		let user = await Voice.findOne({
        userID: member.user.id,
        guildID: member.guild.id
    });
		let data = {}
		data.user = user
		data.config = config
		let channel = member.voice.channel
		return emit('userVoiceMute', data, member, channel, muteType);
		}
  }
}