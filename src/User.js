const merge = require("deepmerge");
const Discord = require("discord.js");
const serialize = require("serialize-javascript");
const { EventEmitter } = require("events");
const { 
  UserData, 
  UserVoiceTimeData, 
  UserLevelingData
 } = require("./Constants.js");
const VoiceManager = require("./Manager.js");

/**
 * Represents a User
 */
class User extends EventEmitter {
  /**
   * @param {VoiceManager} manager The Voice Manager
   * @param {UserData} options The giveaway data
   */
  constructor(manager, options) {
    super();
    /**
     * The Voice manager
     * @type {VoiceManager}
     */
    this.manager = manager;
    /**
     * The Discord Client
     * @type {Client}
     */
    this.client = manager.client;
    /**
     * The user id
     * @type {Snowflake}
     */
    this.userID = options.userID;
    /**
     * The guild ID of the config
     * @type {Snowflake}
     */
    this.guildID = options.guildID;
    /**
     * The user voice time data
     * @type {UserVoiceTimeData}
     */
    this.voiceTime = options.data.voiceTime;
    /**
     * The user leveling data
     * @type {UserLevelingData}
     */
    this.levelingData = options.data.levelingData;
    /**
     * The user data
     * @type {UserData}
     */
    this.options = options.data;
  }

  get guild() {
    return this.client.guilds.cache.get(this.guildID);
  }

  get user() {
    return this.client.users.cache.get(this.userID);
  }

  get channelAndMember() {
    return this.guild.channels.cache
      .filter((c) => c.type == "voice" || c.type == "GUILD_VOICE")
      .map((voicechannel) => {
        return voicechannel.members
          .map((x) => {
            if (!this.manager.users.find((u) => u.userID === x.id)) {
              this.manager.createUser(x.id, x.guild.id);
            }
            if (x.id === this.userID)
              return { channel: voicechannel, member: x };
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
      data: {
        voiceTime: this.voiceTime,
        levelingData: this.levelingData,
      },
    };
    return baseData;
  }

  edit(options = {}) {
    return new Promise(async (resolve, reject) => {
      if (
        typeof options.newVoiceTime === "object" &&
        Array.isArray(options.newVoiceTime.channels) &&
        Number.isInteger(options.newVoiceTime.total)
      )
        this.voiceTime = options.newVoiceTime;
      if (
        typeof options.newLevelingData === "object" &&
        Number.isInteger(options.newLevelingData.xp) &&
        Number.isInteger(options.newLevelingData.level)
      )
        this.levelingData = options.newLevelingData;
      await this.manager.editUser(this.userID, this.guildID, this.data);
      resolve(this);
    });
  }
}
module.exports = User;
