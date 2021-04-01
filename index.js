const mongoose = require("mongoose");
const Voice = require("./models/voice.js");
const VoiceConfig = require("./models/voiceconfig.js");
const logs = require('discord-logs');
let mongoUrl;
const handlevoiceChannelJoin = require('./handlers/voiceChannelJoin.js');
const handlevoiceChannelLeave = require('./handlers/voiceChannelLeave.js');
const handlevoiceChannelMute = require('./handlers/voiceChannelMute.js');
const handlevoiceChannelUnmute = require('./handlers/voiceChannelUnmute.js');
const handlevoiceChannelDeaf = require('./handlers/voiceChannelDeaf.js');
const handlevoiceChannelUndeaf = require('./handlers/voiceChannelUndeaf.js');
/**
 *
 *
 * @class DiscordVoice
 */
class DiscordVoice {
	/**
	 *
	 *
	 * @static
	 * @param {String} dbUrl - A valid mongo database URI.
	 * @return {Promise<mongoose.Connection>} - The mongoose connection promise.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.setURL("mongodb://..."); // You only need to do this ONCE per process.
	 */
	static async setURL(dbUrl) {
		if (!dbUrl) throw new TypeError("A database url was not provided.");
		if(mongoUrl) throw new TypeError("A database url was already configured.");
		mongoUrl = dbUrl;
		return mongoose.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} userId - Discord user id.
	 * @param {String} guildId - Discord guild id.
	 * @return {Promise<Boolean/Object>} - If there is data already present it will return false, if no data is present it will return the user data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.createUser(<UserID - String>, <GuildID - String>); // It will create a dataobject for the user-id provided in the specified guild-id entry.
	 */
	static async createUser(userId, guildId) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
		const isUser = await Voice.findOne({
			userID: userId,
			guildID: guildId
		});
		if (isUser) return false;
		const newUser = new Voice({
			userID: userId,
			guildID: guildId
		});
		await newUser.save().catch(e => console.log(`Failed to create user: ${e}`));
		return newUser;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} userId - Discord user id.
	 * @param {String} guildId - Discord guild id.
	 * @return {Promise<Boolean/Object>} - If there is no data already present it will return false, if data is present it will return the user data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.deleteUser(<UserID - String>, <GuildID - String>); // It will delete the dataobject for the user-id provided in the specified guild-id entry.
	 */
	static async deleteUser(userId, guildId) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
		const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
		});
		if (!user) return false;
		await Voice.findOneAndDelete({
			userID: userId,
			guildID: guildId
		}).catch(e => console.log(`Failed to delete user: ${e}`));
		return user;
	}
	/**
	 *
	 *
	 * @static
	 * @param {Discord.Client} client - The Discord Client.
	 * @return {Promise<Object>} - It return's the user data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.start(<Client - Discord.js Client>); // It will start the voice activity module.
	 */
	static async start(client) {
		if (!client) throw new TypeError("A client was not provided.");
		logs(client);
		client.on("voiceChannelJoin", async (member, channel) => {
				await handlevoiceChannelJoin(client, member, channel, Voice, VoiceConfig)
		});
		client.on("voiceChannelMute", async (member, muteType) => {
				await handlevoiceChannelMute(client, member, muteType, Voice, VoiceConfig)
		});
		client.on("voiceChannelUnmute", async (member, oldMuteType) => {
				await handlevoiceChannelUnmute(client, member, oldMuteType, Voice, VoiceConfig)
		});
		client.on("voiceChannelDeaf", async (member, deafType) => {
				await handlevoiceChannelDeaf(client, member, deafType, Voice, VoiceConfig)
		});
		client.on("voiceChannelUndeaf", async (member, deafType) => {
				await handlevoiceChannelUndeaf(client, member, deafType, Voice, VoiceConfig)
		});
		client.on("voiceChannelLeave", async (member, channel) => {
				await handlevoiceChannelLeave(client, member, channel, Voice, VoiceConfig)
		});
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} userId - Discord user id.
	 * @param {String} guildId - Discord guild id.
	 * @param {Number} voicetime - Amount of voice time in ms to set.
	 * @return {Promise<Object>} - The user data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.setVoiceTime(<UserID - String>, <GuildID - String>, <Amount - Integer>); // It sets the Voice Time of a user in the specified guild to the specified amount. (MAKE SURE TO PROVIDE THE TIME IN MILLISECONDS!)
	 */
	static async setVoiceTime(userId, guildId, voicetime) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (voicetime == 0 || !voicetime || isNaN(parseInt(voicetime))) throw new TypeError("An amount of voice time was not provided/was invalid.");
		const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
		});
		if (!user) return false;
		user.voiceTime = voicetime;
		user.save().catch(e => console.log(`Failed to set voice time: ${e}`));
		return user;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} userId - Discord user id.
	 * @param {String} guildId - Discord guild id.
	 * @param {Boolean} [fetchPosition=false] - Whether to fetch the users position.
	 * @return {Promise<Object>} - The user data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.fetch(<UserID - String>, <GuildID - String>, <FetchPosition - Boolean>); // Retrives selected entry from the database, if it exists.
	 */
	static async fetch(userId, guildId, fetchPosition = false) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
		const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
		});
		if (!user) return false;
		let userobj = {}
		if (fetchPosition === true) {
			const leaderboard = await Voice.find({
				guildID: guildId
			}).sort([
				['voiceTime', 'descending']
			]).exec();
			userobj.position = leaderboard.findIndex(i => i.userID === userId) + 1;
		}
		userobj.data = user
		return userobj;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} userId - Discord user id.
	 * @param {String} guildId - Discord guild id.
	 * @param {Number} voicetime - Amount of voice time in ms to add.
	 * @return {Promise<Object>} - The user data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.addVoiceTime(<UserID - String>, <GuildID - String>, <Amount - Integer>); // It adds a specified amount of voice time in ms to the current amount of voice time for that user, in that guild.
	 */
	static async addVoiceTime(userId, guildId, voicetime) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (voicetime == 0 || !voicetime || isNaN(parseInt(voicetime))) throw new TypeError("An amount of voice time was not provided/was invalid.");
		const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
		});
		if (!user) return false;
		user.voiceTime += parseInt(voicetime, 10);
		user.save().catch(e => console.log(`Failed to add voice time: ${e}`));
		return user;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} userId - Discord user id.
	 * @param {String} guildId - Discord guild id.
	 * @param {Number} voicetime - Amount of voice time in ms to subtract.
	 * @return {Promise<Object>} - The user data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.subtractVoiceTime(<UserID - String>, <GuildID - String>, <Amount - Integer>); // It removes a specified amount of voice time in ms to the current amount of voice time for that user, in that guild.
	 */
	static async subtractVoiceTime(userId, guildId, voicetime) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (voicetime == 0 || !voicetime || isNaN(parseInt(voicetime))) throw new TypeError("An amount of voice time was not provided/was invalid.");
		const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
		});
		if (!user) return false;
		user.voiceTime -= parseInt(voicetime, 10);
		user.save().catch(e => console.log(`Failed to subtract voice time: ${e}`));
		return user;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @return {Boolean} - Return's true if success.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.resetGuild(<GuildID - String>); // It deletes the entire guild's data-object from the database.
	 */
	static async resetGuild(guildId) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		const guild = await Voice.findOne({
			guildID: guildId
		});
		if (!guild) return false;
		await Voice.findOneAndDelete({
			guildID: guildId
		}).catch(e => console.log(`Failed to reset guild: ${e}`));
		await VoiceConfig.findOneAndDelete({
			guildID: guildId
		}).catch(e => console.log(`Failed to reset guild: ${e}`));
		return true;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {Number} limit - Amount of maximum enteries to return.
	 * @return {Promise<Array>} - It will return the leaderboard array.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.fetchLeaderboard(<GuildID - String>, <Limit - Integer>); // It gets a specified amount of entries from the database, ordered from higgest to lowest within the specified limit of entries.
	 */
	static async fetchLeaderboard(guildId, limit) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (!limit) throw new TypeError("A limit was not provided.");
		var users = await Voice.find({
			guildID: guildId
		}).sort([
			['voiceTime', 'descending']
		]).exec();
		return users.slice(0, limit);
	}
	/**
	 *
	 *
	 * @static
	 * @param {Discord.Client} client - Your Discord.CLient.
	 * @param {array} leaderboard - The output from 'fetchLeaderboard' function.
	 * @param {Boolean} [fetchUsers=false] - whether to fetch each users position.
	 * @return {Promise<Array>} - It will return the computedleaderboard array, if fetchUsers is true it will add the position key in the JSON object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.computeLeaderboard(<Client - Discord.js Client>, <Leaderboard - fetchLeaderboard output>, <fetchUsers - boolean, disabled by default>); // It returns a new array of object that include voice time, guild id, user id, leaderboard position (if fetchUsers is set to true), username and discriminator.
	 */
	static async computeLeaderboard(client, leaderboard, fetchUsers = false) {
		if (!client) throw new TypeError("A client was not provided.");
		if (!leaderboard) throw new TypeError("A leaderboard id was not provided.");
		if (leaderboard.length < 1) return [];
		const computedArray = [];
		if (fetchUsers) {
			for (const key of leaderboard) {
				const user = await client.users.fetch(key.userID) || {
					username: "Unknown",
					discriminator: "0000"
				};
				computedArray.push({
					guildID: key.guildID,
					userID: key.userID,
					voiceTime: key.voiceTime,
					position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
					username: user.username,
					discriminator: user.discriminator
				});
			}
		} else {
			leaderboard.map(key => computedArray.push({
				guildID: key.guildID,
				userID: key.userID,
				voiceTime: key.voiceTime,
				position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
				username: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).username : "Unknown",
				discriminator: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).discriminator : "0000"
			}));
		}
		return computedArray;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} userId - Discord user id.
	 * @param {String} guildId - Discord guild id.
	 * @return {Promise<Object>} - It will return the user data-object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.blacklist(<UserID - String>, <GuildID - String>); // It will blacklist the user which will make it not count their voice time.
	 */
	static async blacklist(userId, guildId) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
    const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
    });
		if (!user) {
		const newUser = new Voice({
		userID: member.user.id,
		guildID: member.guild.id,
		oinTime: Date.now()
						});
						await newUser.save().catch(e => console.log(`Failed to save new user.`));
						return newUser;
		}
		user.isBlacklisted = true
		user.save().catch(e => console.log(`Failed to add user to blacklist: ${e}`));
		return user;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} userId - Discord user id.
	 * @param {String} guildId - Discord guild id.
	 * @return {Promise<Object>} - If there is no user data present it will return false, if the use is not blacklisted it will return false, if the user data is present and the user is blacklisted it will return the user-data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.unblacklist(<UserID - String>, <GuildID - String>); It will un-blacklist the user which will make it count their voice time.
	 */
	static async unblacklist(userId, guildId) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
    const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
    });
		if (!user) return false;
		if(!user.isBlacklisted) return false;
		user.isBlacklisted = false
		user.save().catch(e => console.log(`Failed to remove user from blacklist: ${e}`));
		return user;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {Boolean} data - If true it will track all bot's voice activity, if false it will ignore all bot's voice activity.
	 * @return {Promise<Object>} - It will return the config data-object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.trackbots(<GuildID - String>, <Data - Boolean>); It will alter the configuration of trackbots.
	 */
	static async trackbots(guildId, data) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (data != false && data != true) throw new TypeError("The data provided should have been either true or false.");
    const config = await VoiceConfig.findOne({
			guildID: guildId
    });
		if (!config) {
		const newConfig = new VoiceConfig({
		guildID: guildId,
		trackbots: data,
		trackallchannels: true,
		userlimit: 0,
		channelID: [],
		trackMute: true,
	  trackDeaf: true,
		isEnabled: true
		});
		await newConfig.save().catch(e => console.log(`Failed to save new user.`));
		return newConfig;
		}
		config.trackbots = data
		config.save().catch(e => console.log(`Failed to update config: ${e}`));
		return config;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {Boolean} data - If true it will track all the voice channels in the guild, if false it will not track all the voice channels in the guild.
	 * @return {Promise<Object>} - It will return the config data-object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.trackallchannels(<GuildID - String>, <Data - Boolean>); It will alter the configuration of trackallchannels.
	 */
	static async trackallchannels(guildId, data) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (data != false && data != true) throw new TypeError("The data provided should have been either true or false.");
    const config = await VoiceConfig.findOne({
			guildID: guildId
    });
		if (!config) {
		const newConfig = new VoiceConfig({
		guildID: guildId,
		trackbots: false,
		trackallchannels: data,
		userlimit: 0,
		channelID: [],
		trackMute: true,
	  trackDeaf: true,
		isEnabled: true
		});
		await newConfig.save().catch(e => console.log(`Failed to save new user.`));
		return newConfig;
		}
		config.trackallchannels = data
		config.save().catch(e => console.log(`Failed to update config: ${e}`));
		return config;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {Boolean} data - If true it will track the users voice time who are muted aswell, if false it won't count the member's who are not muted.
	 * @return {Promise<Object>} - It will return the config data-object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.trackMute(<GuildID - String>, <Data - Boolean>); It will alter the configuration of trackMute.
	 */
	static async trackMute(guildId, data) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (data != false && data != true) throw new TypeError("The data provided should have been either true or false.");
    const config = await VoiceConfig.findOne({
			guildID: guildId
    });
		if (!config) {
		const newConfig = new VoiceConfig({
		guildID: guildId,
		trackbots: false,
		trackallchannels: true,
		userlimit: 0,
		channelID: [],
		trackMute: data,
	  trackDeaf: true,
		isEnabled: true
		});
		await newConfig.save().catch(e => console.log(`Failed to save new user.`));
		return newConfig;
		}
		config.trackMute = data
		config.save().catch(e => console.log(`Failed to update config: ${e}`));
		return config;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {Boolean} data - If true it will track the users voice time who are deafen aswell, if false it won't count the member's who are not deafen.
	 * @return {Promise<Object>} - It will return the config data-object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.trackDeaf(<GuildID - String>, <Data - Boolean>); It will alter the configuration of trackDeaf.
	 */
	static async trackDeaf(guildId, data) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (data != false && data != true) throw new TypeError("The data provided should have been either true or false.");
    const config = await VoiceConfig.findOne({
			guildID: guildId
    });
		if (!config) {
		const newConfig = new VoiceConfig({
		guildID: guildId,
		trackbots: false,
		trackallchannels: true,
		userlimit: 0,
		channelID: [],
		trackMute: true,
	  trackDeaf: data,
		isEnabled: true
		});
		await newConfig.save().catch(e => console.log(`Failed to save new user.`));
		return newConfig;
		}
		config.trackDeaf = data
		config.save().catch(e => console.log(`Failed to update config: ${e}`));
		return config;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {Number} data - The min limit of users required in channel for it to start counting (0 = unlimited).
	 * @return {Promise<Object>} - It will return the config data-object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.userlimit(<GuildID - String>, <Data - Number>); It will alter the configuration of userlimit.
	 */
	static async userlimit(guildId, data) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (!data || isNaN(parseInt(data))) throw new TypeError("An amount of userlimit was not provided/was invalid.");
    const config = await VoiceConfig.findOne({
			guildID: guildId
    });
		if (!config) {
		const newConfig = new VoiceConfig({
		guildID: guildId,
		trackbots: false,
		trackallchannels: true,
		userlimit: data,
		channelID: [],
		trackMute: true,
	  trackDeaf: true,
		isEnabled: true
		});
		await newConfig.save().catch(e => console.log(`Failed to save new user.`));
		return newConfig;
		}
		config.userlimit = data
		config.save().catch(e => console.log(`Failed to update config: ${e}`));
		return config;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {String} data - The channel id to track the voice activity of. (NOTE: If trackallchannels is true it will still track all of the channels, make sure to set trackallchannels to false before supplying a channelid.)
	 * @return {Promise<Boolean/Object>} - If no data is present it will return false, if the channel id supplied is present in the database it will return false, if there is data present and the channel id is not present in the data it will return the config data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.channelID(<GuildID - String>, <Data - String>); It will alter the configuration of channelID.
	 */
	static async channelID(guildId, data) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (!data) throw new TypeError("A channel id was not provided.");
    const config = await VoiceConfig.findOne({
			guildID: guildId
    });
		if (!config) {
		const newConfig = new VoiceConfig({
		guildID: guildId,
		trackbots: false,
		trackallchannels: true,
		userlimit: 0,
		channelID: [`${data}`],
		trackMute: true,
	  trackDeaf: true,
		isEnabled: true
		});
		await newConfig.save().catch(e => console.log(`Failed to save new user.`));
		return newConfig;
		}
		let array = config.channelID
		if(array.includes(data)) return false;
		array.push(data)
		config.channelID = array
		config.save().catch(e => console.log(`Failed to update config: ${e}`));
		return config;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {String} data - The channel id to remove from the database. (NOTE: If trackallchannels is true it will still track all of the channels, make sure to set trackallchannels to false before supplying a channelid.)
	 * @return {Promise<Boolean/Object>} - If no data is present it will return false, if the channel id supplied is not present in the database it will return false, if there is data present and the channel id is present in the data it will return the config data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.removechannelID(<GuildID - String>, <Data - String>); It will alter the configuration of channelID.
	 */
	static async removechannelID(guildId, data) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if (!data) throw new TypeError("A channel id was not provided.");
    const config = await VoiceConfig.findOne({
			guildID: guildId
    });
		if (!config) return false;
		let array = config.channelID
		if(!array.includes(data)) return false;
		array = array.filter(d => d !== data);
		config.channelID = array
		config.save().catch(e => console.log(`Failed to update config: ${e}`));
		return config;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @param {Boolean} data - If set to true it will count the guild's voice activity, if set to false it won't count any voice activity.
	 * @return {Promise<Object>} - It will return the config data-object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.toggle(<GuildID - String>, <Data - Boolean>); It will alter the configuration of the module.
	 */
	static async toggle(guildId, data) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
		if(data == "on") data = true
		if(data == "off") data = false
		if (data != false && data != true) throw new TypeError("The data provided should have been either true or false.");
    const config = await VoiceConfig.findOne({
			guildID: guildId
    });
		if (!config) {
		const newConfig = new VoiceConfig({
		guildID: guildId,
		trackbots: false,
		trackallchannels: true,
		userlimit: 0,
		channelID: [],
		trackMute: true,
	  trackDeaf: true,
		isEnabled: data
		});
		await newConfig.save().catch(e => console.log(`Failed to save new user.`));
		return newConfig;
		}
		config.isEnabled = data
		config.save().catch(e => console.log(`Failed to update config: ${e}`));
		return config;
	}
	/**
	 *
	 *
	 * @static
	 * @param {String} guildId - Discord guild id.
	 * @return {Promise<Boolean/Object>} - If no data is present it will return false, if there is data present it will return the config data object.
	 * @memberof DiscordVoice
	 * @example
	 * Voice.fetchconfig(<GuildID - String>); It will return the config data object if present.
	 */
	static async fetchconfig(guildId) {
		if (!guildId) throw new TypeError("A guild id was not provided.");
    const config = await VoiceConfig.findOne({
		guildID: guildId
    });
		if (!config) return false;
		return config;
	}
}
module.exports = DiscordVoice;
