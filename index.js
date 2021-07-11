const mongoose = require("mongoose");
const Voice = require("./models/voice.js");
const VoiceConfig = require("./models/voiceconfig.js");
const { EventEmitter } = require("events");
let startRegistered = false;
/**
 *
 *
 * DiscordVoice
 */
class DiscordVoice extends EventEmitter {
  /**
   * @param {Discord.Client} client - The Discord Client
   * @param {String} mongodbURL - The mongodb URL
   * @param {Boolean} [connect=true] - Whether to connect to mongodb or not
   */
  constructor(client, mongodbURL, connect = true) {
    super();
    if (!client) throw new Error("A client was not provided.");
    /**
     * The Discord Client
     * @type {Discord.Client}
     */
    this.client = client;
    if (!mongodbURL) throw new TypeError("A database url was not provided.");
    /**
     * The mongodb URL.
     * @type {String}
     */
    this.dbUrl = mongodbURL;
    if (connect) this._connect();
  }
  /**
   * Connects to mongoDB
   * @ignore
   * @private
   */
  _connect() {
    return mongoose.connect(this.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  }
  /**
   *
   *
   *
   * @param {String} userId - Discord user id.
   * @param {String} guildId - Discord guild id.
   * @return {Promise<Boolean/Object>} - If there is data already present it will return false, if no data is present it will return the user data object.
   *
   * @example
   * client.discordVoice.createUser(<UserID - String>, <GuildID - String>); // It will create a dataobject for the user-id provided in the specified guild-id entry.
   */
  async createUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    const isUser = await Voice.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (isUser) return false;
    const newUser = {
      userID: userId,
      guildID: guildId,
      joinTime: {},
      voiceTime: {},
      isBlacklisted: false,
      lastUpdated: new Date(),
    };
    return await Voice.create(newUser);
  }
  /**
   *
   *
   *
   * @param {String} userId - Discord user id.
   * @param {String} guildId - Discord guild id.
   * @return {Promise<Boolean/Object>} - If there is no data already present it will return false, if data is present it will return the user data object.
   *
   * @example
   * client.discordVoice.deleteUser(<UserID - String>, <GuildID - String>); // It will delete the dataobject for the user-id provided in the specified guild-id entry.
   */
  async deleteUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    const user = await Voice.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) return false;
    await Voice.findOneAndDelete({
      userID: userId,
      guildID: guildId,
    })
      .exec()
      .catch((e) => console.log(`Failed to delete user: ${e}`));
    return user;
  }
  /**
   *
   *
   *
   * @return {Promise<Object>} - It return's the user data object.
   *
   * @example
   * client.discordVoice.start(<Client - Discord.js Client>); // It will start the voice activity module.
   */
  async start() {
    if (startRegistered) return;
    startRegistered = true;
    this.client.on("voiceStateUpdate", (oldState, newState) => {
      require("./events/voiceStateUpdate.js").execute(
        this.client,
        oldState,
        newState,
        Voice,
        VoiceConfig,
        this.emitEvent.bind(this),
      );
    });
  }

  /**
   * Emits the received events
   * @ignore
   * @private
   */
  emitEvent(eventName, ...args) {
    return this.emit(eventName, ...args);
  }

  /**
   *
   *
   *
   * @param {String} userId - Discord user id.
   * @param {String} guildId - Discord guild id.
   * @param {String} channelId - Discord channel id.
   * @param {Number} voicetime - Amount of voice time in ms to set.
   * @return {Promise<Object>} - The user data object.
   *
   * @example
   * client.discordVoice.setVoiceTime(<UserID - String>, <GuildID - String>, <ChannelId - String>, <Amount - Integer>); // It sets the Voice Time of a user in the specified guild to the specified amount. (MAKE SURE TO PROVIDE THE TIME IN MILLISECONDS!)
   */
  async setVoiceTime(userId, guildId, channelId, voicetime) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!channelId) throw new TypeError("A channel id was not provided.");
    if (voicetime == 0 || !voicetime || isNaN(parseInt(voicetime)))
      throw new TypeError(
        "An amount of voice time was not provided/was invalid."
      );
    const user = await Voice.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) return false;
    let voicetimechan = user.voiceTime[channelId];
    if (!voicetimechan) voicetimechan = 0;
    voicetimechan = parseInt(voicetime, 10);
    user.voiceTime[channelId] = voicetimechan;
    let userobj = user.voiceTime;
    delete userobj.total;
    let total = Object.values(userobj).reduce((a, b) => a + b, 0);
    user.voiceTime["total"] = total;
    user.markModified("voiceTime");
    user.save().catch((e) => console.log(`Failed to add voice time: ${e}`));
    return user;
  }
  /**
   *
   *
   *
   * @param {String} userId - Discord user id.
   * @param {String} guildId - Discord guild id.
   * @param {Boolean} [fetchPosition=false] - Whether to fetch the users position.
   * @return {Promise<Object>} - The user data object.
   *
   * @example
   * client.discordVoice.fetch(<UserID - String>, <GuildID - String>, <FetchPosition - Boolean>); // Retrives selected entry from the database, if it exists.
   */
  async fetch(userId, guildId, fetchPosition = false) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    const user = await Voice.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) return false;
    let userobj = {};
    if (fetchPosition === true) {
      const leaderboard = await Voice.find({
        guildID: guildId,
      });
      let usersorted = leaderboard.sort(
        (a, b) => b.voiceTime.total - a.voiceTime.total
      );
      userobj.position = usersorted.findIndex((i) => i.userID === userId) + 1;
    }
    userobj.data = user;
    return userobj;
  }
  /**
   *
   *
   *
   * @param {String} userId - Discord user id.
   * @param {String} guildId - Discord guild id.
   * @param {String} channelId - Discord channel id.
   * @param {Number} voicetime - Amount of voice time in ms to add.
   * @return {Promise<Object>} - The user data object.
   *
   * @example
   * client.discordVoice.addVoiceTime(<UserID - String>, <GuildID - String>, <ChannelId - String>, <Amount - Integer>); // It adds a specified amount of voice time in ms to the current amount of voice time for that user, in that guild.
   */
  async addVoiceTime(userId, guildId, channelId, voicetime) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!channelId) throw new TypeError("A channel id was not provided.");
    if (voicetime == 0 || !voicetime || isNaN(parseInt(voicetime)))
      throw new TypeError(
        "An amount of voice time was not provided/was invalid."
      );
    const user = await Voice.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) return false;
    let voicetimechan = user.voiceTime[channelId];
    if (!voicetimechan) voicetimechan = 0;
    voicetimechan += parseInt(voicetime, 10);
    user.voiceTime[channelId] = voicetimechan;
    let userobj = user.voiceTime;
    delete userobj.total;
    let total = Object.values(userobj).reduce((a, b) => a + b, 0);
    user.voiceTime["total"] = total;
    user.markModified("voiceTime");
    user.save().catch((e) => console.log(`Failed to add voice time: ${e}`));
    return user;
  }
  /**
   *
   *
   *
   * @param {String} userId - Discord user id.
   * @param {String} guildId - Discord guild id.
   * @param {String} channelId - Discord channel id.
   * @param {Number} voicetime - Amount of voice time in ms to subtract.
   * @return {Promise<Object>} - The user data object.
   *
   * @example
   * client.discordVoice.subtractVoiceTime(<UserID - String>, <GuildID - String>, <ChannelId - String>, <Amount - Integer>); // It removes a specified amount of voice time in ms to the current amount of voice time for that user, in that guild.
   */
  async subtractVoiceTime(userId, guildId, channelId, voicetime) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!channelId) throw new TypeError("A channel id was not provided.");
    if (voicetime == 0 || !voicetime || isNaN(parseInt(voicetime)))
      throw new TypeError(
        "An amount of voice time was not provided/was invalid."
      );
    const user = await Voice.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) return false;
    let voicetimechan = user.voiceTime[channelId];
    if (!voicetimechan) voicetimechan = 0;
    voicetimechan -= parseInt(voicetime, 10);
    user.voiceTime[channelId] = voicetimechan;
    let userobj = user.voiceTime;
    delete userobj.total;
    let total = Object.values(userobj).reduce((a, b) => a + b, 0);
    user.voiceTime["total"] = total;
    user.markModified("voiceTime");
    user
      .save()
      .catch((e) => console.log(`Failed to subtract voice time: ${e}`));
    return user;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @return {Boolean} - Return's true if success.
   *
   * @example
   * client.discordVoice.resetGuild(<GuildID - String>); // It deletes the entire guild's data-object from the database.
   */
  async resetGuild(guildId) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    const guild = await Voice.findOne({
      guildID: guildId,
    });
    if (!guild) return false;
    await Voice.findOneAndDelete({
      guildID: guildId,
    })
      .exec()
      .catch((e) => console.log(`Failed to reset guild: ${e}`));
    await VoiceConfig.findOneAndDelete({
      guildID: guildId,
    })
      .exec()
      .catch((e) => console.log(`Failed to reset guild: ${e}`));
    return true;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {Number} limit - Amount of maximum enteries to return.
   * @return {Promise<Array>} - It will return the leaderboard array.
   *
   * @example
   * client.discordVoice.fetchLeaderboard(<GuildID - String>, <Limit - Integer>); // It gets a specified amount of entries from the database, ordered from higgest to lowest within the specified limit of entries.
   */
  async fetchLeaderboard(guildId, limit) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!limit) throw new TypeError("A limit was not provided.");
    const users = await Voice.find({
      guildID: guildId,
    });
    let usersorted = users.sort(
      (a, b) => b.voiceTime.total - a.voiceTime.total
    );
    return usersorted.slice(0, limit);
  }
  /**
   *
   *
   *
   * @param {Discord.Client} client - Your Discord.CLient.
   * @param {array} leaderboard - The output from 'fetchLeaderboard' function.
   * @param {Boolean} [fetchUsers=true] - Whether to fetch the members or get them from cache.
   * @return {Promise<Array>} - It will return the computedleaderboard array, if fetchUsers is true it will add the position key in the JSON object.
   *
   * @example
   * client.discordVoice.computeLeaderboard(<Client - Discord.js Client>, <Leaderboard - fetchLeaderboard output>, <fetchUsers - boolean, enabled by default>); // It returns a new array of object that include voice time, guild id, user id, leaderboard position (if fetchUsers is set to true), username and discriminator.
   */
  async computeLeaderboard(client, leaderboard, fetchUsers = true) {
    if (!client) throw new TypeError("A client was not provided.");
    if (!leaderboard) throw new TypeError("A leaderboard id was not provided.");
    if (leaderboard.length < 1) return [];
    const computedArray = [];
    if (fetchUsers) {
      for (const key of leaderboard) {
        const user = (await client.users.fetch(key.userID)) || {
          username: "Unknown",
          discriminator: "0000",
        };
        computedArray.push({
          guildID: key.guildID,
          userID: key.userID,
          voiceTime: key.voiceTime,
          position:
            leaderboard.findIndex(
              (i) => i.guildID === key.guildID && i.userID === key.userID
            ) + 1,
          username: user.username,
          discriminator: user.discriminator,
        });
      }
    } else {
      leaderboard.map((key) =>
        computedArray.push({
          guildID: key.guildID,
          userID: key.userID,
          voiceTime: key.voiceTime,
          position:
            leaderboard.findIndex(
              (i) => i.guildID === key.guildID && i.userID === key.userID
            ) + 1,
          username: client.users.cache.get(key.userID)
            ? client.users.cache.get(key.userID).username
            : "Unknown",
          discriminator: client.users.cache.get(key.userID)
            ? client.users.cache.get(key.userID).discriminator
            : "0000",
        })
      );
    }
    return computedArray;
  }
  /**
   *
   *
   *
   * @param {String} userId - Discord user id.
   * @param {String} guildId - Discord guild id.
   * @return {Promise<Object>} - It will return the user data-object.
   *
   * @example
   * client.discordVoice.blacklist(<UserID - String>, <GuildID - String>); // It will blacklist the user which will make it not count their voice time.
   */
  async blacklist(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    const user = await Voice.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) {
      userobj = {
        userID: userId,
        guildID: guildId,
        joinTime: {},
        voiceTime: {},
        isBlacklisted: true,
        lastUpdated: new Date(),
      };
      return await Voice.create(userobj).catch((e) =>
        console.log(`Failed to save user: ${e}`)
      );
    }
    user.isBlacklisted = true;
    user.markModified("isBlacklisted");
    user
      .save()
      .catch((e) => console.log(`Failed to add user to blacklist: ${e}`));
    return user;
  }
  /**
   *
   *
   *
   * @param {String} userId - Discord user id.
   * @param {String} guildId - Discord guild id.
   * @return {Promise<Object>} - If there is no user data present it will return false, if the use is not blacklisted it will return false, if the user data is present and the user is blacklisted it will return the user-data object.
   *
   * @example
   * client.discordVoice.unblacklist(<UserID - String>, <GuildID - String>); It will un-blacklist the user which will make it count their voice time.
   */
  async unblacklist(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    const user = await Voice.findOne({
      userID: userId,
      guildID: guildId,
    });
    if (!user) return false;
    if (!user.isBlacklisted) return false;
    user.isBlacklisted = false;
    user.markModified("isBlacklisted");
    user
      .save()
      .catch((e) => console.log(`Failed to remove user from blacklist: ${e}`));
    return user;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {Boolean} data - If true it will track all bot's voice activity, if false it will ignore all bot's voice activity.
   * @return {Promise<Object>} - It will return the config data-object.
   *
   * @example
   * client.discordVoice.trackbots(<GuildID - String>, <Data - Boolean>); It will alter the configuration of trackbots.
   */
  async trackbots(guildId, data) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (data != false && data != true)
      throw new TypeError(
        "The data provided should have been either true or false."
      );
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) {
      const newConfig = {
        guildID: guildId,
        trackbots: data,
        trackallchannels: true,
        userlimit: 0,
        channelID: [],
        trackMute: true,
        trackDeaf: true,
        isEnabled: true,
        lastUpdated: new Date(),
      };
      return await VoiceConfig.create(newConfig).catch((e) =>
        console.log(`Failed to save config: ${e}`)
      );
    }
    config.trackbots = data;
    config.markModified("trackbots");
    config.save().catch((e) => console.log(`Failed to update config: ${e}`));
    return config;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {Boolean} data - If true it will track all the voice channels in the guild, if false it will not track all the voice channels in the guild.
   * @return {Promise<Object>} - It will return the config data-object.
   *
   * @example
   * client.discordVoice.trackallchannels(<GuildID - String>, <Data - Boolean>); It will alter the configuration of trackallchannels.
   */
  async trackallchannels(guildId, data) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (data != false && data != true)
      throw new TypeError(
        "The data provided should have been either true or false."
      );
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) {
      const newConfig = {
        guildID: guildId,
        trackbots: false,
        trackallchannels: data,
        userlimit: 0,
        channelID: [],
        trackMute: true,
        trackDeaf: true,
        isEnabled: true,
        lastUpdated: new Date(),
      };
      return await VoiceConfig.create(newConfig).catch((e) =>
        console.log(`Failed to save config: ${e}`)
      );
    }
    config.trackallchannels = data;
    config.markModified("trackallchannels");
    config.save().catch((e) => console.log(`Failed to update config: ${e}`));
    return config;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {Boolean} data - If true it will track the users voice time who are muted aswell, if false it won't count the member's who are not muted.
   * @return {Promise<Object>} - It will return the config data-object.
   *
   * @example
   * client.discordVoice.trackMute(<GuildID - String>, <Data - Boolean>); It will alter the configuration of trackMute.
   */
  async trackMute(guildId, data) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (data != false && data != true)
      throw new TypeError(
        "The data provided should have been either true or false."
      );
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) {
      const newConfig = {
        guildID: guildId,
        trackbots: false,
        trackallchannels: true,
        userlimit: 0,
        channelID: [],
        trackMute: data,
        trackDeaf: true,
        isEnabled: true,
        lastUpdated: new Date(),
      };
      return await VoiceConfig.create(newConfig).catch((e) =>
        console.log(`Failed to save config: ${e}`)
      );
    }
    config.trackMute = data;
    config.markModified("trackMute");
    config.save().catch((e) => console.log(`Failed to update config: ${e}`));
    return config;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {Boolean} data - If true it will track the users voice time who are deafen aswell, if false it won't count the member's who are not deafen.
   * @return {Promise<Object>} - It will return the config data-object.
   *
   * @example
   * client.discordVoice.trackDeaf(<GuildID - String>, <Data - Boolean>); It will alter the configuration of trackDeaf.
   */
  async trackDeaf(guildId, data) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (data != false && data != true)
      throw new TypeError(
        "The data provided should have been either true or false."
      );
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) {
      const newConfig = {
        guildID: guildId,
        trackbots: false,
        trackallchannels: true,
        userlimit: 0,
        channelID: [],
        trackMute: true,
        trackDeaf: data,
        isEnabled: true,
        lastUpdated: new Date(),
      };
      return await VoiceConfig.create(newConfig).catch((e) =>
        console.log(`Failed to save config: ${e}`)
      );
    }
    config.trackDeaf = data;
    config.markModified("trackDeaf");
    config.save().catch((e) => console.log(`Failed to update config: ${e}`));
    return config;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {Number} data - The min limit of users required in channel for it to start counting (0 = unlimited).
   * @return {Promise<Object>} - It will return the config data-object.
   *
   * @example
   * client.discordVoice.userlimit(<GuildID - String>, <Data - Number>); It will alter the configuration of userlimit.
   */
  async userlimit(guildId, data) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!data || isNaN(parseInt(data)))
      throw new TypeError(
        "An amount of userlimit was not provided/was invalid."
      );
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) {
      const newConfig = {
        guildID: guildId,
        trackbots: false,
        trackallchannels: true,
        userlimit: data,
        channelID: [],
        trackMute: true,
        trackDeaf: true,
        isEnabled: true,
        lastUpdated: new Date(),
      };
      return await VoiceConfig.create(newConfig).catch((e) =>
        console.log(`Failed to save config: ${e}`)
      );
    }
    config.userlimit = data;
    config.markModified("userlimit");
    config.save().catch((e) => console.log(`Failed to update config: ${e}`));
    return config;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {String} data - The channel id to track the voice activity of. (NOTE: If trackallchannels is true it will still track all of the channels, make sure to set trackallchannels to false before supplying a channelid.)
   * @return {Promise<Boolean/Object>} - If no data is present it will return false, if the channel id supplied is present in the database it will return false, if there is data present and the channel id is not present in the data it will return the config data object.
   *
   * @example
   * client.discordVoice.channelID(<GuildID - String>, <Data - String>); It will alter the configuration of channelID.
   */
  async channelID(guildId, data) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!data) throw new TypeError("A channel id was not provided.");
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) {
      const newConfig = {
        guildID: guildId,
        trackbots: false,
        trackallchannels: true,
        userlimit: 0,
        channelID: [`${data}`],
        trackMute: true,
        trackDeaf: true,
        isEnabled: true,
        lastUpdated: new Date(),
      };
      return await VoiceConfig.create(newConfig).catch((e) =>
        console.log(`Failed to save config: ${e}`)
      );
    }
    let array = config.channelID;
    if (array.includes(data)) return false;
    array.push(data);
    config.channelID = array;
    config.markModified("channelID");
    config.save().catch((e) => console.log(`Failed to update config: ${e}`));
    return config;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {String} data - The channel id to remove from the database. (NOTE: If trackallchannels is true it will still track all of the channels, make sure to set trackallchannels to false before supplying a channelid.)
   * @return {Promise<Boolean/Object>} - If no data is present it will return false, if the channel id supplied is not present in the database it will return false, if there is data present and the channel id is present in the data it will return the config data object.
   *
   * @example
   * client.discordVoice.removechannelID(<GuildID - String>, <Data - String>); It will alter the configuration of channelID.
   */
  async removechannelID(guildId, data) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!data) throw new TypeError("A channel id was not provided.");
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) return false;
    let array = config.channelID;
    if (!array.includes(data)) return false;
    array = array.filter((d) => d !== data);
    config.channelID = array;
    config.markModified("channelID");
    config.save().catch((e) => console.log(`Failed to update config: ${e}`));
    return config;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @param {Boolean} data - If set to true it will count the guild's voice activity, if set to false it won't count any voice activity.
   * @return {Promise<Object>} - It will return the config data-object.
   *
   * @example
   * client.discordVoice.toggle(<GuildID - String>, <Data - Boolean>); It will alter the configuration of the module.
   */
  async toggle(guildId, data) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (data == "on") data = true;
    if (data == "off") data = false;
    if (data != false && data != true)
      throw new TypeError(
        "The data provided should have been either true or false."
      );
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) {
      const newConfig = {
        guildID: guildId,
        trackbots: false,
        trackallchannels: true,
        userlimit: 0,
        channelID: [],
        trackMute: true,
        trackDeaf: true,
        isEnabled: data,
        lastUpdated: new Date(),
      };
      return await VoiceConfig.create(newConfig).catch((e) =>
        console.log(`Failed to save config: ${e}`)
      );
    }
    config.isEnabled = data;
    config.markModified("isEnabled");
    config.save().catch((e) => console.log(`Failed to update config: ${e}`));
    return config;
  }
  /**
   *
   *
   *
   * @param {String} guildId - Discord guild id.
   * @return {Promise<Boolean/Object>} - If no data is present it will return false, if there is data present it will return the config data object.
   *
   * @example
   * client.discordVoice.fetchconfig(<GuildID - String>); It will return the config data object if present.
   */
  async fetchconfig(guildId) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    const config = await VoiceConfig.findOne({
      guildID: guildId,
    });
    if (!config) return false;
    return config;
  }
}
  /**
   * Emitted when a user join's any vc.
   * @event DiscordVoice#userVoiceJoin
   * @param {Object} data The user and config data object
   * @param {Discord.GuildMember} member The guild member
   * @param {Discord.VoiceChannel} channel The voice channel
   * @param {Boolean} isNew Whether the user is new or not (Newly created in the database)
   *
   * @example
   * // This can be used to add features such as logging a user voice activity in a logs channel
   * client.discordVoice.on('userVoiceJoin', (data, member, channel, isNew) => {
   * let logchannel = member.guild.channels.cache.get("xxxxxxxxxxxxxxxxxx")
   * return logchannel.send(`${member.user.username} joined ${channel.name} vc!`);
   * });
   */

  /**
   * Emitted when a user swicthes between vc's.
   * @event DiscordVoice#userVoiceSwitch
   * @param {Discord.GuildMember} member The guild member
   * @param {Discord.VoiceChannel} oldChannel The user's old voice channel
   * @param {Discord.VoiceChannel} newChannel The user's new voice channel
   *
   * @example
   * // This can be used to add features such as logging a user voice activity in a logs channel
   * client.discordVoice.on('userVoiceSwitch', (member, oldChannel, newChannel) => {
   * let logchannel = member.guild.channels.cache.get("xxxxxxxxxxxxxxxxxx")
   * return logchannel.send(`${member.user.username} swicthed from ${oldChannel.name} to ${newChannel.name} vc!`);
   * });
   */

  /**
   * Emitted when a user mutes in the vc.
   * @event DiscordVoice#userVoiceMute
   * @param {Object} data The user and config data object
   * @param {Discord.GuildMember} member The guild member
   * @param {Discord.VoiceChannel} channel The voice channel
   * @param {String} MuteType The MuteType of the user
   *
   * @example
   * // This can be used to add features such as logging a user voice activity in a logs channel
   * client.discordVoice.on('userVoiceMute', (data, member, channel, MuteType) => {
   * let logchannel = member.guild.channels.cache.get("xxxxxxxxxxxxxxxxxx")
   * return logchannel.send(`${member.user.username} has muted their mic in ${channel.name}\nTheir mute type is: ${MuteType}`);
   * });
   */

  /**
   * Emitted when a user un-mutes in the vc.
   * @event DiscordVoice#userVoiceUnMute
   * @param {Object} data The user and config data object
   * @param {Discord.GuildMember} member The guild member
   * @param {Discord.VoiceChannel} channel The voice channel
   * @param {String} oldMuteType The oldMuteType of the user
   * @param {Boolean} isNew Whether the user is new or not (Newly created in the database)
   *
   * @example
   * // This can be used to add features such as logging a user voice activity in a logs channel
   * client.discordVoice.on('userVoiceUnMute', (data, member, channel, oldMuteType, isNew) => {
   * let logchannel = member.guild.channels.cache.get("xxxxxxxxxxxxxxxxxx")
   * return logchannel.send(`${member.user.username} has un-muted their mic in ${channel.name}\nTheir previous mute type was: ${oldMuteType}`);
   * });
   */

  /**
   * Emitted when a user deafens in the vc.
   * @event DiscordVoice#userVoiceDeaf
   * @param {Object} data The user and config data object
   * @param {Discord.GuildMember} member The guild member
   * @param {Discord.VoiceChannel} channel The voice channel
   * @param {String} DeafType The DeafType of the user
   *
   * @example
   * // This can be used to add features such as logging a user voice activity in a logs channel
   * client.discordVoice.on('userVoiceDeaf', (data, member, channel, DeafType) => {
   * let logchannel = member.guild.channels.cache.get("xxxxxxxxxxxxxxxxxx")
   * return logchannel.send(`${member.user.username} has become deafen in ${channel.name}\nTheir deaf type is: ${DeafType}`);
   * });
   */

  /**
   * Emitted when a user un-deafens in the vc.
   * @event DiscordVoice#userVoiceUnDeaf
   * @param {Object} data The user and config data object
   * @param {Discord.GuildMember} member The guild member
   * @param {Discord.VoiceChannel} channel The voice channel
   * @param {String} oldDeafType The oldDeafType of the user
   * @param {Boolean} isNew Whether the user is new or not (Newly created in the database)
   *
   * @example
   * // This can be used to add features such as logging a user voice activity in a logs channel
   * client.discordVoice.on('userVoiceUnDeaf', (data, member, channel, oldDeafType, isNew) => {
   * let logchannel = member.guild.channels.cache.get("xxxxxxxxxxxxxxxxxx")
   * return logchannel.send(`${member.user.username} has become un-deafen in ${channel.name}\nTheir previous deaf type was: ${oldDeafType}`);
   * });
   */

  /**
   * Emitted when a user leaves the vc.
   * @event DiscordVoice#userVoiceLeave
   * @param {Object} data The user and config data object
   * @param {Discord.GuildMember} member The guild member
   * @param {Discord.VoiceChannel} channel The voice channel
   *
   * @example
   * // This can be used to add features such as logging a user voice activity in a logs channel
   * client.discordVoice.on('userVoiceLeave', (data, member, channel) => {
   * let logchannel = member.guild.channels.cache.get("xxxxxxxxxxxxxxxxxx")
   * return logchannel.send(`${member.user.username} has left ${channel.name} vc!`);
   * });
   */

  /**
   * Emitted when there was a error executing the tracking functions.
   * @event DiscordVoice#unhandledVoiceStateUpdate
   * @param {Object} data The user and config data object
   * @param {Discord.VoiceState} oldState The oldState of the member
   * @param {Discord.VoiceState} newState The newState of the member
   *
   * @example
   * // This can be used to add features such as logging a user voice activity in a logs channel
   * client.discordVoice.on('unhandledVoiceStateUpdate', (oldState, newState) => {
   * let logchannel = oldState.member.guild.channels.cache.get("xxxxxxxxxxxxxxxxxx")
   * return logchannel.send(`Voice state for member ${oldState.member.user.username} was updated but discord-voice couldn't find what was updated!`);
   * });
   */
  
module.exports = DiscordVoice;
