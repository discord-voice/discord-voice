const { EventEmitter } = require('node:events');

class Channel extends EventEmitter {
    constructor(manager, guild, channelId, options) {
        super();
        this.manager = manager;
        this.client = manager.client;
        this.guild = guild;
        this.guildId = guild.guildId;
        this.channelId = channelId;
        this.timeInChannel = options.timeInChannel;
        this.options = options;
    }

    get data() {
        const baseData = {
            guildId: this.guildId,
            channelId: this.channelId,
            timeInChannel: this.timeInChannel
        };
        return baseData;
    }

    edit(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (typeof options !== 'object') return reject(new Error('Options must be an object.'));
            if (typeof options.timeInChannel !== 'number')
                return reject(new Error('Options.timeInChannel must be a number.'));

            await this.manager.editGuild(this.guild.guildId, this.guild.data);

            resolve(this);
        });
    }
}
module.exports = Channel;
