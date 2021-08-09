const merge = require("deepmerge");
const Discord = require("discord.js");
const serialize = require("serialize-javascript");
const { EventEmitter } = require("events");
const {
  ConfigOptions,
  ConfigData,
  ConfigEditOptions,
} = require("./Constants.js");
const VoiceManager = require("./Manager.js");

/**
 * Represents a Config
 */
class Config extends EventEmitter {
  /**
   * @param {VoiceManager} manager The Voice Manager
   * @param {ConfigOptions} options The giveaway data
   */
  constructor(manager, options) {
    super();
    /**
     * The Voice Manager
     * @type {VoiceManager}
     */
    this.manager = manager;
    /**
     * The guild ID of the config
     * @type {Snowflake}
     */
    this.guildID = options.guildID;
    /**
     * The config data
     * @type {ConfigOptions}
     */
    this.options = options.data;
  }

  get trackBots() {
    return this.options.trackBots || this.manager.options.default.trackBots;
  }
  get trackMute() {
    return this.options.trackMute || this.manager.options.default.trackMute;
  }
  get trackDeaf() {
    return this.options.trackDeaf || this.manager.options.default.trackDeaf;
  }
  get trackAllChannels() {
    return (
      this.options.trackAllChannels ||
      this.manager.options.default.trackAllChannels
    );
  }
  get minUserCountToParticipate() {
    return (
      this.options.minUserCountToParticipate ||
      this.manager.options.default.minUserCountToParticipate
    );
  }
  get maxUserCountToParticipate() {
    return (
      this.options.maxUserCountToParticipate ||
      this.manager.options.default.maxUserCountToParticipate
    );
  }
  get minXPToParticipate() {
    return (
      this.options.minXPToParticipate ||
      this.manager.options.default.minXPToParticipate
    );
  }
  get minLevelToParticipate() {
    return (
      this.options.minLevelToParticipate ||
      this.manager.options.default.minLevelToParticipate
    );
  }
  get maxXPToParticipate() {
    return (
      this.options.maxXPToParticipate ||
      this.manager.options.default.maxXPToParticipate
    );
  }
  get maxLevelToParticipate() {
    return (
      this.options.maxLevelToParticipate ||
      this.manager.options.default.maxLevelToParticipate
    );
  }
  get voiceTimeTrackingEnabled() {
    return (
      this.options.voiceTimeTrackingEnabled ||
      this.manager.options.default.voiceTimeTrackingEnabled
    );
  }
  get levelingTrackingEnabled() {
    return (
      this.options.levelingTrackingEnabled ||
      this.manager.options.default.levelingTrackingEnabled
    );
  }
  get data() {
    const baseData = {
      guildID: this.guildID,
      data: {
        trackBots: this.options.trackBots,
        trackAllChannels: this.options.trackAllChannels,
        exemptChannels:
          !this.options.exemptChannels ||
          typeof this.options.exemptChannels === "string"
            ? this.options.exemptChannels
            : serialize(this.options.exemptChannels),
        channelIDs: this.options.channelIDs,
        exemptPermissions: this.options.exemptPermissions,
        exemptMembers:
          !this.options.exemptMembers ||
          typeof this.options.exemptMembers === "string"
            ? this.options.exemptMembers
            : serialize(this.options.exemptMembers),
        trackMute: this.options.trackMute,
        trackDeaf: this.options.trackDeaf,
        isEnabled: this.options.isEnabled,
        minUserCountToParticipate: this.options.minUserCountToParticipate,
        maxUserCountToParticipate: this.options.maxUserCountToParticipate,
        minXPToParticipate: this.options.minXPToParticipate,
        minLevelToParticipate: this.options.minLevelToParticipate,
        maxXPToParticipate: this.options.maxXPToParticipate,
        maxLevelToParticipate: this.options.maxLevelToParticipate,
        xpAmountToAdd:
          !this.options.xpAmountToAdd ||
          typeof this.options.xpAmountToAdd === "string"
            ? this.options.xpAmountToAdd
            : serialize(this.options.xpAmountToAdd),
        voiceTimeToAdd:
          !this.options.voiceTimeToAdd ||
          typeof this.options.voiceTimeToAdd === "string"
            ? this.options.voiceTimeToAdd
            : serialize(this.options.voiceTimeToAdd),
        voiceTimeTrackingEnabled: this.options.voiceTimeTrackingEnabled,
        levelingTrackingEnabled: this.options.levelingTrackingEnabled,
      },
    };
    return baseData;
  }
  get exemptPermissions() {
    return Array.isArray(this.options.exemptPermissions) &&
      this.options.exemptPermissions.length
      ? this.options.exemptPermissions
      : this.manager.options.default.exemptPermissions;
  }
  get exemptMembersFunction() {
    return this.options.exemptMembers
      ? typeof this.options.exemptMembers === "string" &&
        this.options.exemptMembers.includes("function anonymous")
        ? eval(`(${this.options.exemptMembers})`)
        : eval(this.options.exemptMembers)
      : null;
  }
  get xpAmountToAddFunction() {
    return this.options.xpAmountToAdd
      ? typeof this.options.xpAmountToAdd === "string" &&
        this.options.xpAmountToAdd.includes("function anonymous")
        ? eval(`(${this.options.xpAmountToAdd})`)
        : eval(this.options.xpAmountToAdd)
      : null;
  }
  get voiceTimeToAddFunction() {
    return this.options.voiceTimeToAdd
      ? typeof this.options.voiceTimeToAdd === "string" &&
        this.options.voiceTimeToAdd.includes("function anonymous")
        ? eval(`(${this.options.voiceTimeToAdd})`)
        : eval(this.options.voiceTimeToAdd)
      : null;
  }
  async exemptMembers(member) {
    if (typeof this.exemptMembersFunction === "function") {
      try {
        const result = await this.exemptMembersFunction(member);
        return result;
      } catch (err) {
        console.error(
          `User ID: ${member.id}\nGuild ID: ${this.guildID}\nChannel ID: ${
            member.voice.channel.id
          }\n${serialize(this.exemptMembersFunction)}\n${err}`
        );
        return false;
      }
    }
    if (typeof this.manager.options.default.exemptMembers === "function") {
      return await this.manager.options.default.exemptMembers(member);
    }
    return false;
  }
  async xpAmountToAdd() {
    if (typeof this.xpAmountToAddFunction === "function") {
      try {
        const result = await this.xpAmountToAddFunction();
        if (typeof result === "number") return result;
        else return Math.floor(Math.random() * 10) + 1;
      } catch (err) {
        console.error(
          `xpAmountToAdd Config Error\n${serialize(
            this.xpAmountToAddFunction
          )}\n${err}`
        );
        return Math.floor(Math.random() * 10) + 1;
      }
    }
    if (typeof this.manager.options.default.xpAmountToAdd === "function") {
      const result = await this.manager.options.default.xpAmountToAdd();
      if (typeof result === "number") return result;
      else return Math.floor(Math.random() * 10) + 1;
    }
    return Math.floor(Math.random() * 10) + 1;
  }
  async voiceTimeToAdd() {
    if (typeof this.voiceTimeToAddFunction === "function") {
      try {
        const result = await this.voiceTimeToAddFunction();
        if (typeof result === "number") return result;
        else return 1000;
      } catch (err) {
        console.error(
          `voiceTimeToAdd Config Error\n${serialize(
            this.voiceTimeToAddFunction
          )}\n${err}`
        );
        return 1000;
      }
    }
    if (typeof this.manager.options.default.voiceTimeToAdd === "function") {
      const result = await this.manager.options.default.voiceTimeToAdd();
      if (typeof result === "number") return result;
      else return 1000;
    }
    return 1000;
  }
  async checkMember(member) {
    const exemptMember = await this.exemptMembers(member);
    if (exemptMember) return false;
    const hasPermission = this.exemptPermissions.some((permission) =>
      member.permissions.has(permission)
    );
    if (hasPermission) return false;
    if (!this.trackBots && member.user.bot) return false;
    if (!this.trackMute && (member.voice.selfMute || member.voice.serverMute))
      return false;
    if (!this.trackDeaf && (member.voice.selfDeaf || member.voice.serverDeaf))
      return false;
    if (
      this.minXPToParticipate &&
      member.data.data.levelingData.xp < this.minXPToParticipate
    )
      return false;
    if (
      this.minLevelToParticipate > 0 &&
      member.data.data.levelingData.level < this.minLevelToParticipate
    )
      return false;
    if (
      this.maxXPToParticipate > 0 &&
      member.data.data.levelingData.xp > this.maxXPToParticipate
    )
      return false;
    if (
      this.maxLevelToParticipate > 0 &&
      member.data.data.levelingData.level > this.maxLevelToParticipate
    )
      return false;
    return true;
  }
  get exemptChannelsFunction() {
    return this.options.exemptChannels
      ? typeof this.options.exemptChannels === "string" &&
        this.options.exemptChannels.includes("function anonymous")
        ? eval(`(${this.options.exemptChannels})`)
        : eval(this.options.exemptChannels)
      : null;
  }
  async exemptChannels(channel) {
    if (typeof this.exemptChannelsFunction === "function") {
      try {
        const result = await this.exemptChannelsFunction(channel);
        return result;
      } catch (err) {
        console.error(
          `Guild ID: ${this.guildID}\nChannel ID: ${channel.id}\n${serialize(
            this.exemptChannelsFunction
          )}\n${err}`
        );
        return false;
      }
    }
    if (typeof this.manager.options.default.exemptChannels === "function") {
      return await this.manager.options.default.exemptChannels(channel);
    }
    return false;
  }
  async checkChannel(channel) {
    const exemptChannel = await this.exemptChannels(channel);
    if (exemptChannel) return false;
    if (!this.trackAllChannels && !this.channelIDs.includes(channel.id))
      return false;
    if (
      this.minUserCountToParticipate > 0 &&
      channel.members.size < this.minUserCountToParticipate
    )
      return false;
    if (
      this.maxUserCountToParticipate > 0 &&
      channel.members.size > this.maxUserCountToParticipate
    )
      return false;
    return true;
  }
  edit(options = {}) {
    return new Promise(async (resolve, reject) => {
      if (typeof options.newTrackBots === "boolean")
        this.options.trackBots = options.newTrackBots;
      if (typeof options.newTrackAllChannels === "boolean")
        this.options.trackAllChannels = options.newTrackAllChannels;
      if (
        typeof options.newExemptChannels === "string" &&
        options.newExemptChannels.includes("function anonymous")
      )
        this.options.exemptChannels = options.newExemptChannels;
      if (Array.isArray(options.newChannelIDs))
        this.options.channelIDs = options.newChannelIDs;
      if (Array.isArray(options.newExemptPermissions))
        this.options.exemptPermissions = options.newExemptPermissions;
      if (
        typeof options.newExemptMembers === "string" &&
        options.newExemptMembers.includes("function anonymous")
      )
        this.options.exemptMembers = options.newExemptMembers;
      if (typeof options.newTrackMute === "boolean")
        this.options.trackMute = options.newTrackMute;
      if (typeof options.newTrackDeaf === "boolean")
        this.options.trackDeaf = options.newTrackDeaf;
      if (typeof options.newIsEnabled === "boolean")
        this.options.isEnabled = options.newIsEnabled;
      if (Number.isInteger(options.newMinUserCountToParticipate))
        this.options.minUserCountToParticipate =
          options.newMinUserCountToParticipate;
      if (Number.isInteger(options.newMaxUserCountToParticipate))
        this.options.maxUserCountToParticipate =
          options.newMaxUserCountToParticipate;
      if (Number.isInteger(options.newMinXPToParticipate))
        this.options.minXPToParticipate = options.newMinXPToParticipate;
      if (Number.isInteger(options.newMinLevelToParticipate))
        this.options.minLevelToParticipate = options.newMinLevelToParticipate;
      if (Number.isInteger(options.newMaxXPToParticipate))
        this.options.maxXPToParticipate = options.newMaxXPToParticipate;
      if (Number.isInteger(options.newMaxLevelToParticipate))
        this.options.maxLevelToParticipate = options.newMaxLevelToParticipate;
      if (
        typeof options.newXPAmountToAdd === "string" &&
        options.newXPAmountToAdd.includes("function anonymous")
      )
        this.options.xpAmountToAdd = options.newXPAmountToAdd;
      if (
        typeof options.newVoiceTimeToAdd === "string" &&
        options.newVoiceTimeToAdd.includes("function anonymous")
      )
        this.options.voiceTimeToAdd = options.newVoiceTimeToAdd;
      if (typeof options.newVoiceTimeTrackingEnabled === "boolean")
        this.options.voiceTimeTrackingEnabled =
          options.newVoiceTimeTrackingEnabled;
      if (typeof options.newLevelingTrackingEnabled === "boolean")
        this.options.levelingTrackingEnabled =
          options.newLevelingTrackingEnabled;
      await this.manager.editConfig(this.guildID, this.data);
      resolve(this);
    });
  }
}
module.exports = Config;
