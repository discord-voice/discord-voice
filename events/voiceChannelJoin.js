module.exports = {
  execute: async (client, member, channel, Voice, VoiceConfig) => {

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
    if (!config.trackbots)
      if (member.bot) return;
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
    const user = await Voice.findOne({
      userID: member.user.id,
      guildID: member.guild.id
    });
    if (!config.trackallchannels) {
      if (config.channelID.includes(channel.id)) {
        if (config.userlimit != 0) {
          if (channel.members.size < userlimit) return;
        }
        if (!user) {
          const newUser = new Voice({
            userID: member.user.id,
            guildID: member.guild.id,
            joinTime: Date.now()
          });
          await newUser.save().catch(e => console.log(`Failed to save new user.`));
          return newUser;
        }
        if (user.isBlacklisted) return;
        user.joinTime = Date.now();
        await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
        return user;
      }
    }
    if (config.trackallchannels) {
      if (config.userlimit != 0) {
        if (channel.members.size < userlimit) return;
      }
      if (!user) {
        const newUser = new Voice({
          userID: member.user.id,
          guildID: member.guild.id,
          joinTime: Date.now()
        });
        await newUser.save().catch(e => console.log(`Failed to save new user.`));
        return user;
      }
      if (user.isBlacklisted) return;
      user.joinTime = Date.now();
      await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
      return user;
    }
  }
}