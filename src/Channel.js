const { EventEmitter } = require('node:events');
const { ChannelOptions, ChannelData, ChannelEditOptions } = require('./Constants');
const VoiceTimeManager = require('./Manager');

/**
 * Represents a Channel.
 */
class Channel extends EventEmitter {
    /**
     *
     * @param {VoiceTimeManager} manager The voice time manager.
     * @param {Guild} guild The guild class.
     * @param {Snowflake} channelId The channel id.
     * @param {ChannelOptions} options The channel options.
    */
    constructor(manager, guild, channelId, options) {
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
         * The channel id.
         * @type {Snowflake}
         */
        this.channelId = channelId;
        /**
         * The time spent in this channel.
         * @type {number}
         */
        this.timeInChannel = options.timeInChannel;
        /**
         * The options for this channel.
         * @type {ChannelOptions}
        */
        this.options = options;
    }

    /**
     * The raw channel data object.
     * @type {ChannelData}
     * @readonly
     */
    get data() {
        const baseData = {
            guildId: this.guildId,
            channelId: this.channelId,
            timeInChannel: this.timeInChannel
        };
        return baseData;
    }

    /**
     * Edits the channel.
     *
     * @param {ChannelEditOptions} options The new channel options.
     * @returns {Promise<Channel>}
     */
    edit(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (typeof options !== 'object') return reject(new Error('Options must be an object.'));
            if (typeof options.timeInChannel !== 'number')
                return reject(new Error('Options.timeInChannel must be a number.'));

            if(options.timeInChannel) {
                this.timeInChannel = options.timeInChannel;
            }
            
            await this.manager.editGuild(this.guild.guildId, this.guild.data);

            resolve(this);
        });
    }
}
module.exports = Channel;
