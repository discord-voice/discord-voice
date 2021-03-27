const mongoose = require("mongoose");
const Voice = require("./models/voice.js");
const logs = require('discord-logs');
let mongoUrl;
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
	 * @param {string} dbUrl - A valid mongo database URI.
	 * @return {Promise} - The mongoose connection promise.
	 * @memberof DiscordVoice
	 */
	static async setURL(dbUrl) {
		if (!dbUrl) throw new TypeError("A database url was not provided.");
		if (mongoUrl) throw new TypeError("A database url was already configured.");
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
	 * @param {string} userId - Discord user id.
	 * @param {string} guildId - Discord guild id.
	 * @return {object} - The user data object.
	 * @memberof DiscordVoice
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
	 * @param {string} userId - Discord user id.
	 * @param {string} guildId - Discord guild id.
	 * @return {object} - The user data object.
	 * @memberof DiscordVoice
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
	 * @param {boolean} [trackbots=false] - Wheter to track bot's voice activity.
	 * @param {boolean} [trackallchannels=true] - Wheter to track all the voice channels.
	 * @param {number} [userlimit = 0] - Track when only the voice-channel member count has reached the specified number, 0 = unlimited.
	 * @param {string} [channelID] - If trackallchannels is false the function will check activity for only the specified channelid.
	 * @return {object} - The user data object. 
	 * @memberof DiscordVoice
	 */
	static async start(client, trackbots = false, trackallchannels = true, userlimit = 0, channelID) {
		if (!client) throw new TypeError("A client was not provided.");
		if (!trackallchannels && !channelID) throw new TypeError("A channel ID was not provided.");
		logs(client);
		client.on("voiceChannelJoin", async (member, channel) => {
			if (!trackbots) if (member.bot) return;
			const user = await Voice.findOne({
				userID: member.user.id,
				guildID: member.guild.id
			});
			if (!trackallchannels) {
				if (channel.id === channelID) {
					if (userlimit != 0) {
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
			if (trackallchannels) {
				if (userlimit != 0) {
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
		});
		client.on("voiceChannelLeave", async (member, channel) => {
			let user = await Voice.findOne({
				userID: member.user.id,
				guildID: member.guild.id
			});
			if (!trackallchannels) {
				if (userlimit != 0) {
					if (channel.members.size < userlimit) return;
				}
				if (channel.id === channelID) {
					if (user) {
						if (user.isBlacklisted) return;
						let time = (Date.now() - user.joinTime)
						let finaltime = +time + +user.voiceTime
						user.voiceTime = finaltime
						user.joinTime = 0
						await user.save().catch(e => console.log(`Failed to save user voice time: ${e}`));
						return user;
					}
				}
			}
			if (trackallchannels) {
				if (userlimit != 0) {
					if (channel.members.size < userlimit) return;
				}
				if (user) {
					if (user.isBlacklisted) return;
					let time = (Date.now() - user.joinTime)
					let finaltime = +time + +user.voiceTime
					user.voiceTime = finaltime
					user.joinTime = 0
					await user.save().catch(e => console.log(`Failed to save user voice time: ${e}`));
					return user;
				}
			}
		});
		client.on("voiceStateUpdated", async (oldState, newState) => {
			console.log(oldState)
		})
	}
	/**
	 *
	 *
	 * @static
	 * @param {string} userId - Discord user id.
	 * @param {string} guildId - Discord guild id.
	 * @param {number} voicetime - Amount of voice time in ms to set.
	 * @return {object} - The user data object.
	 * @memberof DiscordVoice
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
	 * @param {string} userId - Discord user id.
	 * @param {string} guildId - Discord guild id.
	 * @param {boolean} [fetchPosition=false] - Whether to fetch the users position.
	 * @return {object} - The user data object.
	 * @memberof DiscordVoice
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
	 * @param {string} userId - Discord user id.
	 * @param {string} guildId - Discord guild id.
	 * @param {number} voicetime - Amount of voice time in ms to add.
	 * @return {object} - The user data object.
	 * @memberof DiscordVoice
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
	 * @param {string} userId - Discord user id.
	 * @param {string} guildId - Discord guild id.
	 * @param {number} voicetime - Amount of voice time in ms to subtract.
	 * @return {object} - The user data object.
	 * @memberof DiscordVoice
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
	 * @param {string} guildId - Discord guild id.
	 * @return {boolean} - Return's true if success.
	 * @memberof DiscordVoice
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
		return true;
	}
	/**
	 *
	 *
	 * @static
	 * @param {string} guildId - Discord guild id.
	 * @param {number} limit - Amount of maximum enteries to return.
	 * @return {Array} - The leaderboard array.
	 * @memberof DiscordVoice
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
	 * @param {boolean} [fetchUsers=false] - whether to fetch each users position.
	 * @return {Array} - The leaderboard array.
	 * @memberof DiscordVoice
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
	 * @param {string} userId - Discord user id.
	 * @param {string} guildId - Discord guild id.
	 * @return {object} - The user data object.
	 * @memberof DiscordVoice
	 */
	static async blacklist(userId, guildId) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
		const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
		});
		if (!user) return false;
		user.isBlacklisted = true
		user.save().catch(e => console.log(`Failed to add user to blacklist: ${e}`));
		return user;
	}
	/**
	 *
	 *
	 * @static
	 * @param {string} userId - Discord user id.
	 * @param {string} guildId - Discord guild id.
	 * @return {object} - The user data object.
	 * @memberof DiscordVoice
	 */
	static async unblacklist(userId, guildId) {
		if (!userId) throw new TypeError("An user id was not provided.");
		if (!guildId) throw new TypeError("A guild id was not provided.");
		const user = await Voice.findOne({
			userID: userId,
			guildID: guildId
		});
		if (!user) return false;
		if (!user.isBlacklisted) return false;
		user.isBlacklisted = false
		user.save().catch(e => console.log(`Failed to remove user from blacklist: ${e}`));
		return user;
	}
	/**
	 *
	 *
	 * @static
	  * @param {Discord.Client} client - Your Discord.CLient.
	 * @param {boolean} [enable=true] - Enable or disable 
	 * @param {object} 
	 * @example 
	 * {
	 *  stream : {enable: true, roleId: ""}
	 *  cam : {enable: true, roleId: ""}
	 * }
	 */
	static async roleGiver(client, enable = true, options) {
		if (!client) throw new Error('Client was not found. Please enter Client as option');
		if (!options) throw new Error('No options was provided. Please provide some options');
		const streamRoleId = options.stream.roleId;
		const camRoleId = options.cam.roleId;
		if (!camRoleId) throw new Error('No correct cam roleId was provided');
		if (!streamRoleId) throw new Error('No correct stream roleId was provided');

		if (enable) {
			client.on('voiceStateUpdate', (oldState, newState) => {
				if (!newState) return;
				const guild = oldState.guild;
				const streamRole = guild.roles.cache.get(streamRoleId);
				const camRole = guild.roles.cache.get(camRoleId);
				if (!streamRole) throw new Error(`Stream role not found`);
				if (!camRole) throw new Error(`Cam role not found`);
				if (options.stream.enable) {
					if (!oldState.streaming && newState.streaming) {
						if (newState.member.roles.cache.has(streamRole.id)) return;
						oldState.member.roles.add(streamRole, `Streaming role`);
					}
					// STREAMING STOP
					if (oldState.streaming && !newState.streaming) {
						if (!newState.member.roles.cache.has(streamRole.id)) return;
						oldState.member.roles.remove(streamRole, `Streaming role`);
					}
				}
				if (options.cam.enable) {
					// CAM START
					if (!oldState.selfVideo && newState.selfVideo) {
						if (newState.member.roles.cache.has(camRole.id)) return;
						oldState.member.roles.add(camRole, `Cam role`)
					}
					// CAM STOP

					if (oldState.selfVideo && !newState.selfVideo) {
						if (!newState.member.roles.cache.has(camRole.id)) return;
						oldState.member.roles.remove(camRole, `Cam role`)
					}
				}
			})
		}
	}
}
module.exports = DiscordVoice;
