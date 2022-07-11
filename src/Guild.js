const { EventEmitter } = require('node:events');
const Discord = require('discord.js');
const User = require('./User.js');
const Config = require('./Config.js');
const { deepmerge } = require('deepmerge-ts');
const { GuildOptions, ConfigOptions } = require('./Constants.js');
const VoiceManager = require('./Manager.js');

/**
 * Represents a Guild.
 */
class Guild extends EventEmitter {
    /**
     *
     * @param {VoiceManager} manager The voice time manager.
     * @param {Discord.Snowflake} guildId The guild id.
     * @param {GuildOptions} options The guild options.
     */
    constructor(manager, guildId, options) {
        super();
        /**
         * The voice time manager.
         * @type {VoiceManager}
         */
        this.manager = manager;
        /**
         * The Discord client.
         * @type {Discord.Client}
         */
        this.client = manager.client;
        /**
         * The guild id.
         * @type {Discord.Snowflake}
         */
        this.guildId = guildId;
        /**
         * The users stored in this guild.
         * @type {Discord.Collection<Discord.Snowflake, User>}
         */
        this.users = new Discord.Collection(
            options.users.map((user) => [user.userId, new User(manager, this, user.userId, user)])
        );
        /**
         * The config for this guild.
         * @type {Config}
         */
        this.config = new Config(manager, this, options.config);
        /**
         * The options for this guild.
         * @type {GuildOptions}
         */
        this.options = options;
    }
    
    get guild() {
        return this.client.guilds.cache.get(this.guildId);
    }

    get data() {
        const baseData = {
            guildId: this.guildId,
            users: this.users.map((u) => u.data),
            config: this.config.data
        };
        return baseData;
    }

    edit(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (typeof options !== 'object') return reject(new Error('Options must be an object.'));
            if (!Array.isArrayoptions(options.users)) return reject(new Error('Options.users must be an array.'));
            if (typeof options.config !== 'object') return reject(new Error('Options.config must be an object.'));

            // Set the channel array into our channels collection
            this.users.clear();
            options.users.forEach((user) => {
                if (user instanceof User) {
                    this.users.set(user.id, user);
                }
            });

            // Set the config
            options.config = deepmerge(ConfigOptions, options.config);
            this.config = new Config(this.manager, this, options.config);

            await this.manager.editGuild(this.guildId, this.data);

            resolve(this);
        });
    }
}
module.exports = Guild;
