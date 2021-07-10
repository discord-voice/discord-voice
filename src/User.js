const merge = require("deepmerge");
const Discord = require("discord.js");
const serialize = require("serialize-javascript");
const { EventEmitter } = require("events");
const { } = require("./Constants.js");
const VoiceManager = require("./Manager.js");

class User extends EventEmitter {
  constructor(manager, options) {
    super();
    this.manager = manager;
    this.client = manager.client;
    this.userID = options.userID;
    this.guildID = options.guildID;
    this.options = options;
  }

  get guild() {
    return this.client.guilds.cache.get(this.guildID);
  }

  get user() {
    return this.client.users.cache.get(this.userID);
  }

  get channelAndMember() {
    this.guild.channels.cache
      .filter((c) => c.type == "voice")
      .forEach((voicechannel) => {
        voicechannel.members.forEach((x) => {
          if (!this.manager.users.find((u) => u.userID === x.id)) {
            this.manager.users.push(
              new User(this, {
                userID: x.id,
                guildID: x.guild.id,
                voiceTime: [],
              })
            );
            this.manager.saveUser(x.id, x.guild.id, {
              userID: x.id,
              guildID: x.guild.id,
              voiceTime: [],
            });
          }
          if (x.id === this.userID) return { channel: voicechannel, member: x };
        });
      });
  }

  get channel() {
    return this.channelAndMember.channel;
  }

  get member() {
    return this.channelAndMember.member;
  }

  get data() {
    const baseData = {
      userID: this.userID,
      guildID: this.guildID,
      voiceTime: this.options.voiceTime,
    };
    return baseData;
  }
}