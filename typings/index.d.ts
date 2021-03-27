declare module 'discord-voice' {
import {
        Client
       } from 'discord.js';
import * as Mongoose from "mongoose";

export = DiscordVoice;
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
    static setURL(dbUrl: string): Promise<Mongoose.Connection>;
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
    static createUser(userId: string, guildId: string): Promise<boolean>;
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
    static deleteUser(userId: string, guildId: string): Promise<boolean>;
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
    static start(client: Client): Promise<any>;
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
    static setVoiceTime(userId: string, guildId: string, voicetime: number): Promise<any>;
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
    static fetch(userId: string, guildId: string, fetchPosition?: boolean): Promise<any>;
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
    static addVoiceTime(userId: string, guildId: string, voicetime: number): Promise<any>;
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
    static subtractVoiceTime(userId: string, guildId: string, voicetime: number): Promise<any>;
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
    static resetGuild(guildId: string): boolean;
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
    static fetchLeaderboard(guildId: string, limit: number): Promise<any[]>;
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
    static computeLeaderboard(client: any, leaderboard: any[], fetchUsers?: boolean): Promise<any[]>;
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
    static blacklist(userId: string, guildId: string): Promise<any>;
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
    static unblacklist(userId: string, guildId: string): Promise<any>;
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
    static trackbots(guildId: string, data: boolean): Promise<any>;
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
    static trackallchannels(guildId: string, data: boolean): Promise<any>;
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
    static trackMute(guildId: string, data: boolean): Promise<any>;
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
    static trackDeaf(guildId: string, data: boolean): Promise<any>;
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
    static userlimit(guildId: string, data: number): Promise<any>;
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
    static channelID(guildId: string, data: string): Promise<boolean>;
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
    static removechannelID(guildId: string, data: string): Promise<boolean>;
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
    static toggle(guildId: string, data: boolean): Promise<any>;
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
    static fetchconfig(guildId: string): Promise<boolean>;
}
}