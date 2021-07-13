const merge = require("deepmerge");
const Discord = require("discord.js");
const serialize = require("serialize-javascript");
const { EventEmitter } = require("events");
const {} = require("./Constants.js");
const VoiceManager = require("./Manager.js");

class User extends EventEmitter {
  constructor(manager, options) {
    super();
    this.manager = manager;
    this.client = manager.client;
    this.userID = options.userID;
    this.guildID = options.guildID;
    this.voiceTime = options.voiceTime;
    this.options = options;
  }

  get guild() {
    return this.client.guilds.cache.get(this.guildID);
  }

  get user() {
    return this.client.users.cache.get(this.userID);
  }

  get channelAndMember() {
    return this.guild.channels.cache
      .filter((c) => c.type == "voice")
      .map((voicechannel) => {
        return voicechannel.members
          .map((x) => {
            if (!this.manager.users.find((u) => u.userID === x.id)) {
              this.manager.users.push(
                new User(this, {
                  userID: x.id,
                  guildID: x.guild.id,
                  voiceTime: {
                    channels: [],
                    total: 0,
                  },
                })
              );
              this.manager.saveUser(x.id, x.guild.id, {
                userID: x.id,
                guildID: x.guild.id,
                voiceTime: {
                  channels: [],
                  total: 0,
                },
              });
            }
            if (x.id === this.userID) return { channel: voicechannel, member: x };
          })
          .find((val) => val);
      })
      .find((val) => val);
  }

  get channel() {
    let returnedJSONObject = this.channelAndMember;
    if (returnedJSONObject) return returnedJSONObject.channel;
    else return null;
  }

  get member() {
    let returnedJSONObject = this.channelAndMember;
    if (returnedJSONObject) return returnedJSONObject.member;
    else return null;
  }

  get data() {
    const baseData = {
      userID: this.userID,
      guildID: this.guildID,
      voiceTime: this.voiceTime,
    };
    return baseData;
  }
}
module.exports = User;
