const voiceChannelJoin = async function(client, member, channel, Voice, VoiceConfig){
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
    if (!config.isEnabled) return;
    if (!config.trackbots) if (member.bot) return;
    if (!config.trackMute) {
      if (member.voice.selfMute || member.voice.serverMute) {
        const muteType = member.voice.selfMute ? 'self-muted' : 'server-muted';
        return client.emit("voiceChannelMute", member, muteType);
      }
    }
    if (!config.trackDeaf) {
      if (member.voice.selfDeaf || member.voice.serverDeaf) {
        const deafType = member.voice.selfDeaf ? 'self-deafed' : 'server-v';
        return client.emit('voiceChannelDeaf', member, deafType);
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
				return await Voice.create(user);
        }
        if (user.isBlacklisted) return;
        user.joinTime[channel.id] = Date.now();
				user.markModified('joinTime')
        await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
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
				return await Voice.create(user);
      }
      if (user.isBlacklisted) return;
      user.joinTime[channel.id] = Date.now();
			user.markModified('joinTime')
      await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
      return user;
    }
		}

module.exports = voiceChannelJoin