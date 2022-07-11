const { EventEmitter } = require('node:events');
const Discord = require('discord.js');
const User = require('./User.js');
const Config = require('./Config.js');
const { deepmerge } = require('deepmerge-ts/*');
const {
    ConfigOptions
} = require('./Constants.js');

class Guild extends EventEmitter {
    constructor(manager, guildId, options) {
        super();
        this.manager = manager;
        this.client = manager.client;
        this.guildId = guildId;
        this.users = new Discord.Collection(
            options.users.map((user) => [user.userId, new User(manager, this, user.userId, user)])
        );
        this.config = new Config(manager, this, options.config);
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
