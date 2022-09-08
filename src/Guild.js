const { EventEmitter } = require('node:events');
const Discord = require('discord.js');
const User = require('./User.js');
const Config = require('./Config.js');
const { GuildData, GuildEditOptions } = require('./Constants.js');
const VoiceTimeManager = require('./Manager.js');

/**
 * Represents a Guild.
 */
class Guild extends EventEmitter {
    /**
     *
     * @param {VoiceTimeManager} manager The voice time manager.
     * @param {GuildData} options The guild data.
     */
    constructor(manager, options) {
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
         * The guild id.
         * @type {Snowflake}
         */
        this.guildId = options.guildId;
        /**
         * The users stored in this guild.
         * @type {Collection<Snowflake, User>}
         */
        this.users = new Discord.Collection(
            options.users.map((user) => [user.userId, new User(manager, this, user)])
        );
        /**
         * The config for this guild.
         * @type {Config}
         */
        this.config = new Config(manager, this, options.config);
        /**
         * The extra data for this guild.
         * @type {any}
         */
        this.extraData = options.extraData;
        /**
         * The guild data.
         * @type {GuildData}
         */
        this.options = options;
    }

    /**
     * The discord guild.
     * @type {DiscordGuild}
     * @readonly
     */
    get guild() {
        return this.client.guilds.cache.get(this.guildId);
    }

    /**
     * The raw guild data object.
     * @type {GuildData}
     * @readonly
     */
    get data() {
        const baseData = {
            guildId: this.guildId,
            users: this.users.map((u) => u.data),
            config: this.config.data,
            extraData: this.extraData
        };
        return baseData;
    }

    /**
     * Edits the guild.
     *
     * @param {GuildEditOptions} options The options to edit the guild with.
     * @returns {Promise<Guild>}
     */
    edit(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (typeof options !== 'object') return reject(new Error('Options must be an object.'));
            if (!Array.isArrayoptions(options.users)) return reject(new Error('Options.users must be an array.'));
            if (typeof options.config !== 'object') return reject(new Error('Options.config must be an object.'));

            if (options.users) {
                // Set the channel array into our channels collection
                this.users.clear();
                options.users.forEach((user) => {
                    if (user instanceof User) {
                        this.users.set(user.id, user);
                    }
                });
            }

            if (options.config) {
                this.config = new Config(this.manager, this, options.config);
            }

            if (options.extraData) {
                // Set the extra data
                this.extraData = options.extraData;
            }

            await this.manager.editGuild(this.guildId, this.data);

            resolve(this);
        });
    }
}

module.exports = Guild;
