module.exports = {
  execute: async(client, member, oldMuteType, Voice, VoiceConfig, emit) => { 
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
					if (!user) {
          user = {
       	  userID: member.user.id,
          guildID: member.guild.id,
          joinTime: {},
				  voiceTime: {},
          isBlacklisted: false,
				  lastUpdated: new Date()
          }
				  user.joinTime[member.voice.channel.id] = Date.now();
			  	let data = {}
				  data.user = user
				  data.config = config
				  emit('userVoiceUnMute', data, member, member.voice.channel, oldMuteType, true)
					return await Voice.create(user).catch(e => console.log(`Failed to save user voice time: ${e}`));
          }
          if (user.isBlacklisted) return;
          let jointime = user.joinTime[member.voice.channel.id]
					if(!jointime) jointime = 0
					if(jointime != 0) return require('./voiceChannelLeave.js').execute(client, member, member.voice.channel, Voice, VoiceConfig);
      		jointime = Date.now();
					user.joinTime[member.voice.channel.id] = jointime
					user.markModified('joinTime')
          await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
          let data = {}
				  data.user = user
				  data.config = config
				  emit('userVoiceUnMute', data, member, member.voice.channel, oldMuteType, false)
					return user;
        }
      }
      if (config.trackallchannels) {
        if (!user) {
        user = {
        userID: member.user.id,
        guildID: member.guild.id,
        joinTime: {},
				voiceTime: {},
        isBlacklisted: false,
				lastUpdated: new Date()
        }
				user.joinTime[member.voice.channel.id] = Date.now();
				let data = {}
				data.user = user
				data.config = config
				emit('userVoiceUnMute', data, member, member.voice.channel, oldMuteType, true)
				return await Voice.create(user).catch(e => console.log(`Failed to save user voice time: ${e}`));
        }
        if (user.isBlacklisted) return;
        let jointime = user.joinTime[member.voice.channel.id]
				if(!jointime) jointime = 0
				if(jointime != 0) return require('./voiceChannelLeave.js').execute(client, member, member.voice.channel, Voice, VoiceConfig);
      	jointime = Date.now();
				user.joinTime[member.voice.channel.id] = jointime
				user.markModified('joinTime')
        await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
        let data = {}
				data.user = user
				data.config = config
				emit('userVoiceUnMute', data, member, member.voice.channel, oldMuteType, false)
				return user;
      }
    } else {
		let user = await Voice.findOne({
        userID: member.user.id,
        guildID: member.guild.id
    });
		let channel = member.voice.channel
		let data = {}
		data.config = config
		if(!user){
		data.user = null
		return emit('userVoiceUnMute', data, member, channel, oldMuteType, true);
		}
		data.user = user
		return emit('userVoiceUnMute', data, member, channel, oldMuteType, false);
		}
  }
}
