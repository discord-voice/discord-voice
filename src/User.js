const { EventEmitter } = require('node:events');
const Discord = require('discord.js');
const Channel = require('./Channel.js');

class User extends EventEmitter {
    constructor(manager, guild, userId, options) {
        super();
        this.manager = manager;
        this.client = manager.client;
        this.userId = userId;
        this.guild = guild;
        this.guildId = guild.guildId;
        this.channels = new Discord.Collection(
            options.channels.map((channel) => [
                channel.channelId,
                new Channel(manager, guild, channel.channelId, channel)
            ])
        );
        this.totalVoiceTime = options.totalVoiceTime;
        this.xp = options.xp;
        this.level = options.level;
        this.options = options;
    }

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

    edit(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (typeof options !== 'object') return reject(new Error('Options must be an object.'));
            if (!Array.isArrayoptions(options.channels)) return reject(new Error('Options.channels must be an array.'));
            if (typeof options.totalVoiceTime !== 'number')
                return reject(new Error('Options.totalVoiceTime must be a number.'));
            if (typeof options.xp !== 'number') return reject(new Error('Options.xp must be a number.'));
            if (typeof options.level !== 'number') return reject(new Error('Options.level must be a number.'));

            // Set the channel array into our channels collection
            this.channels.clear();
            options.channels.forEach((channel) => {
                this.channels.set(channel.id, channel);
            });

            // Set the total voice time
            this.totalVoiceTime = options.totalVoiceTime;

            // Set the xp
            this.xp = options.xp;

            // Set the level
            this.level = options.level;

            await this.manager.editGuild(this.guild.guildId, this.guild.data);

            resolve(this);
        });
    }
}
module.exports = User;
