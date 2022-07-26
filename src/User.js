const { EventEmitter } = require('node:events');
const Discord = require('discord.js');
const Channel = require('./Channel.js');
const { UserOptions, UserEditOptions } = require('./Constants.js');
const Guild = require('./Guild.js');
const VoiceTimeManager = require('./Manager.js');

/**
 * Represents a User.
 */
class User extends EventEmitter {
    /**
     *
     * @param {VoiceTimeManager} manager The voice time manager.
     * @param {Guild} guild The guild class.
     * @param {Snowflake} userId The user id.
     * @param {UserOptions} options The user options.
     */
    constructor(manager, guild, userId, options) {
        super();
        /**
         * The voice time manager.
         * @type {VoiceTimeManager}
         */
        this.manager = manager;
        /**
         * The Discord client.
         * @type {Client}
         */
        this.client = manager.client;
        /**
         * The guild class.
         * @type {Guild}
         */
        this.guild = guild;
        /**
         * The guild id.
         * @type {Snowflake}
         */
        this.guildId = guild.guildId;
        /**
         * The user id.
         * @type {Snowflake}
         */
        this.userId = userId;
        /**
         * The channels stored in this user.
         * @type {Collection<Snowflake, Channel>}
         */
        this.channels = new Discord.Collection(
            options.channels.map((channel) => [
                channel.channelId,
                new Channel(manager, guild, channel.channelId, channel)
            ])
        );
        /**
         * The total voice time.
         * @type {number}
         */
        this.totalVoiceTime = options.totalVoiceTime;
        /**
         * The xp.
         * @type {number}
         */
        this.xp = options.xp;
        /**
         * The level.
         * @type {number}
         */
        this.level = options.level;
        /**
         * The options for this user.
         * @type {UserOptions}
         */
        this.options = options;
    }

    /**
     * The raw user data object.
     * @type {UserData}
     * @readonly
     */
    get data() {
        const baseData = {
            guildId: this.guildId,
            userId: this.userId,
            channels: this.channels.map((c) => c.data),
            totalVoiceTime: this.totalVoiceTime,
            xp: this.xp,
            level: this.level
        };
        return baseData;
    }

    /**
     * Edits the user.
     *
     * @param {UserEditOptions} options The options to edit.
     * @returns {Promise<User>}
     */
    edit(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (typeof options !== 'object') return reject(new Error('Options must be an object.'));
            if (!Array.isArrayoptions(options.channels)) return reject(new Error('Options.channels must be an array.'));
            if (typeof options.totalVoiceTime !== 'number')
                return reject(new Error('Options.totalVoiceTime must be a number.'));
            if (typeof options.xp !== 'number') return reject(new Error('Options.xp must be a number.'));
            if (typeof options.level !== 'number') return reject(new Error('Options.level must be a number.'));

            if (options.channels) {
                // Set the channel array into our channels collection
                this.channels.clear();
                options.channels.forEach((channel) => {
                    this.channels.set(channel.id, channel);
                });
            }

            if (options.totalVoiceTime) {
                // Set the total voice time
                this.totalVoiceTime = options.totalVoiceTime;
            }

            if (options.xp) {
                // Set the xp
                this.xp = options.xp;
            }

            if (options.level) {
                // Set the level
                this.level = options.level;
            }

            await this.manager.editGuild(this.guild.guildId, this.guild.data);

            resolve(this);
        });
    }
}

module.exports = User;
