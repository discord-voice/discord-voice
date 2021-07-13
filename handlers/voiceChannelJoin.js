module.exports = {
  execute: async(client, member, channel, Voice, VoiceConfig, emit) => {
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
      };
			await VoiceConfig.create(config).catch(e => console.log(`Failed to save config: ${e}`));
    }
    if (!config.isEnabled) return;
    if (!config.trackbots) if (member.bot) return;
    if (!config.trackMute) {
      if (member.voice.selfMute || member.voice.serverMute) {
        const muteType = member.voice.selfMute ? 'self-muted' : 'server-muted';
        return require('./voiceChannelMute.js').execute(client, member, muteType, Voice, VoiceConfig);
      }
    }
    if (!config.trackDeaf) {
      if (member.voice.selfDeaf || member.voice.serverDeaf) {
        const deafType = member.voice.selfDeaf ? 'self-deafed' : 'server-v';
        return require('./voiceChannelMute.js').execute(client, member, deafType, Voice, VoiceConfig);
      }
    }
    let user = await Voice.findOne({
      userID: member.user.id,
      guildID: member.guild.id
    });
    if (!config.trackallchannels) {
      if (config.channelID.includes(channel.id)) {
        if (config.userlimit != 0) {
          if (channel.members.size < userlimit) return;
        }
        if (!user) {
        user = {
        userID: member.user.id,
        guildID: member.guild.id,
        joinTime: {},
				voiceTime: {},
        isBlacklisted: false,
				lastUpdated: new Date()
        }
				user.joinTime[channel.id] = Date.now();
				let data = {}
				data.user = user
				data.config = config
				emit('userVoiceJoin', data, member, channel, true)
				return await Voice.create(user).catch(e => console.log(`Failed to save user voice time: ${e}`));
        }
        if (user.isBlacklisted) return;
				let jointime = user.joinTime[channel.id]
				if(!jointime) jointime = 0
				if(jointime != 0) return require('./voiceChannelLeave.js').execute(client, member, channel, Voice, VoiceConfig);
      	jointime = Date.now();
				user.joinTime[channel.id] = jointime
				user.markModified('joinTime')
				await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
        let data = {}
				data.user = user
				data.config = config
				emit('userVoiceJoin', data, member, channel, false)
				return user;
      }
    }
    if (config.trackallchannels) {
      if (config.userlimit != 0) {
        if (channel.members.size < userlimit) return;
      }
      if (!user) {
        user = {
        userID: member.user.id,
        guildID: member.guild.id,
        joinTime: {},
				voiceTime: {},
        isBlacklisted: false,
				lastUpdated: new Date()
        }
				user.joinTime[channel.id] = Date.now();
				let data = {}
				data.user = user
				data.config = config
				emit("userVoiceJoin", data, member, channel, true);
				return await Voice.create(user).catch(e => console.log(`Failed to save user voice time: ${e}`));
      }
      if (user.isBlacklisted) return;
			let jointime = user.joinTime[channel.id]
			if(!jointime) jointime = 0
			if(jointime != 0) return require('./voiceChannelLeave.js').execute(client, member, channel, Voice, VoiceConfig);
      jointime = Date.now();
			user.joinTime[channel.id] = jointime
			user.markModified('joinTime')
      await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
      let data = {}
			data.user = user
			data.config = config
			emit("userVoiceJoin", data, member, channel, false);
			return user;
    }
		}
}