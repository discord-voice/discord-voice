async function handlevoiceChannelUndeaf(client, member, deafType, Voice, VoiceConfig) {
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
    if (!config.trackDeaf) {
      let user = await Voice.findOne({
        userID: member.user.id,
        guildID: member.guild.id
      });
      if (!user) {
        user = new Voice({
          userID: member.user.id,
          guildID: member.guild.id,
          voiceTime: 0,
          joinTime: 0
        });
        await user.save().catch(e => console.log(`Failed to save new user.`));
      }
      if (!config.trackallchannels) {
        if (config.channelID.includes(member.voice.channel.id)) {
          if (user.isBlacklisted) return;
          if (user.joinTime != 0) return;
          user.joinTime = Date.now();
          await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
          return user;
        }
      }
      if (config.trackallchannels) {
        if (user.isBlacklisted) return;
        if (user.joinTime != 0) return;
        user.joinTime = Date.now();
        await user.save().catch(e => console.log(`Failed to save user join time: ${e}`));
        return user;
      }
    }
  }
module.exports = handlevoiceChannelUndeaf