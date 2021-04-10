module.exports = {
  execute: async(client, member, oldMuteType, Voice, VoiceConfig) => {    
		let config;
    config = await VoiceConfig.findOne({
      guildID: member.guild.id
    });
    if (!config) {
      config = new VoiceConfig({
        guildID: member.guild.id,
        trackbots: false,
        trackallchannels: true,
        userlimit: 0,
        channelID: [],
        trackMute: true,
        trackDeaf: true,
        isEnabled: true
      });
      await config.save().catch(e => console.log(`Failed to save config: ${e}`));
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
				  user.joinTime[channel.id] = Date.now();
			  	return await Voice.create(user);
          }
          if (user.isBlacklisted) return;
          if (user.joinTime[member.voice.channel.id] != 0) return;
          user.joinTime[member.voice.channel.id] = Date.now();
			    user.markModified('joinTime')
          await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
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
				user.joinTime[channel.id] = Date.now();
				return await Voice.create(user);
        }
        if (user.isBlacklisted) return;
        if (user.joinTime[member.voice.channel.id] != 0) return;
        user.joinTime[member.voice.channel.id] = Date.now();
			  user.markModified('joinTime')
        await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
        return user;
      }
    }
  }
}