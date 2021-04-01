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
    }
    if (!config.isEnabled) return;
    if (!config.trackbots)
      if (member.bot) return;
    const user = await Voice.findOne({
      userID: member.user.id,
      guildID: member.guild.id
    });
    if (!config.trackallchannels) {
      if (config.channelID.includes(channel.id)) {
        if (user) {
          if (user.isBlacklisted) return;
          if (user.joinTime == 0) return;
          let time = (Date.now() - user.joinTime)
          let finaltime = +time + +user.voiceTime
          user.voiceTime = finaltime
          user.joinTime = 0
          await user.save().catch(e => console.log(`Failed to save user voice time: ${e}`));
          return user;
        } else return;
      }
    }
    if (config.trackallchannels) {
      if (user) {
        if (user.isBlacklisted) return;
        if (user.joinTime == 0) return;
        let time = (Date.now() - user.joinTime)
        let finaltime = +time + +user.voiceTime
        user.voiceTime = finaltime
        user.joinTime = 0
        await user.save().catch(e => console.log(`Failed to save user voice time: ${e}`));
        return user;
      } else return;
    }
  }
}