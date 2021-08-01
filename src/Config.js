const merge = require("deepmerge");
const Discord = require("discord.js");
const serialize = require("serialize-javascript");
const { EventEmitter } = require("events");
const {} = require("./Constants.js");
const VoiceManager = require("./Manager.js");

class Config extends EventEmitter {
  constructor(manager, options) {
    super();
    this.manager = manager;
    this.guildID = options.guildID;
    this.options = options.data;
  }

  get isEnabled() {
    return this.options.isEnabled || this.manager.options.default.isEnabled;
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
  get userLimit() {
    return this.options.userLimit || this.manager.options.default.userLimit;
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
        userLimit: this.options.userLimit,
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
    if (this.userLimit > 0 && channel.members.size < this.userLimit)
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
      if (Number.isInteger(options.newUserLimit))
        this.options.userLimit = options.newUserLimit;
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
      await this.manager.editConfig(this.guildID, this.data);
      resolve(this);
    });
  }
}
module.exports = Config;
