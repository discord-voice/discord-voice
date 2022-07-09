const { EventEmitter } = require('node:events');
const serialize = require('serialize-javascript');

class Config extends EventEmitter {
    constructor(manager, guild, options) {
        super();
        this.manager = manager;
        this.guild = guild;
        this.guildId = guild.guildId;
        this.options = options;
    }
    get trackBots() {
        return this.options.trackBots || this.manager.options.default.trackBots;
    }
    get trackMute() {
        return this.options.trackMute || this.manager.options.default.trackMute;
    }
    get trackDeaf() {
        return this.options.trackDeaf || this.manager.options.default.trackDeaf;
    }
    get trackAllChannels() {
        return this.options.trackAllChannels || this.manager.options.default.trackAllChannels;
    }
    get channelIds() {
        return this.options.channelIds || this.manager.options.default.channelIds;
    }
    get minUserCountToParticipate() {
        return this.options.minUserCountToParticipate || this.manager.options.default.minUserCountToParticipate;
    }
    get maxUserCountToParticipate() {
        return this.options.maxUserCountToParticipate || this.manager.options.default.maxUserCountToParticipate;
    }
    get minXpToParticipate() {
        return this.options.minXpToParticipate || this.manager.options.default.minXpToParticipate;
    }
    get minLevelToParticipate() {
        return this.options.minLevelToParticipate || this.manager.options.default.minLevelToParticipate;
    }
    get maxXpToParticipate() {
        return this.options.maxXpToParticipate || this.manager.options.default.maxXpToParticipate;
    }
    get maxLevelToParticipate() {
        return this.options.maxLevelToParticipate || this.manager.options.default.maxLevelToParticipate;
    }
    get voiceTimeTrackingEnabled() {
        return this.options.voiceTimeTrackingEnabled || this.manager.options.default.voiceTimeTrackingEnabled;
    }
    get levelingTrackingEnabled() {
        return this.options.levelingTrackingEnabled || this.manager.options.default.levelingTrackingEnabled;
    }
    get data() {
        const baseData = {
            guildId: this.guildId,
            trackBots: this.options.trackBots,
            trackAllChannels: this.options.trackAllChannels,
            exemptChannels:
                !this.options.exemptChannels || typeof this.options.exemptChannels === 'string'
                    ? this.options.exemptChannels
                    : serialize(this.options.exemptChannels),
            channelIds: this.options.channelIds,
            exemptPermissions: this.options.exemptPermissions,
            exemptMembers:
                !this.options.exemptMembers || typeof this.options.exemptMembers === 'string'
                    ? this.options.exemptMembers
                    : serialize(this.options.exemptMembers),
            trackMute: this.options.trackMute,
            trackDeaf: this.options.trackDeaf,
            minUserCountToParticipate: this.options.minUserCountToParticipate,
            maxUserCountToParticipate: this.options.maxUserCountToParticipate,
            minXpToParticipate: this.options.minXpToParticipate,
            minLevelToParticipate: this.options.minLevelToParticipate,
            maxXpToParticipate: this.options.maxXpToParticipate,
            maxLevelToParticipate: this.options.maxLevelToParticipate,
            xpAmountToAdd:
                !this.options.xpAmountToAdd || typeof this.options.xpAmountToAdd === 'string'
                    ? this.options.xpAmountToAdd
                    : serialize(this.options.xpAmountToAdd),
            voiceTimeToAdd:
                !this.options.voiceTimeToAdd || typeof this.options.voiceTimeToAdd === 'string'
                    ? this.options.voiceTimeToAdd
                    : serialize(this.options.voiceTimeToAdd),
            voiceTimeTrackingEnabled: this.options.voiceTimeTrackingEnabled,
            levelingTrackingEnabled: this.options.levelingTrackingEnabled,
            levelMultiplier:
                !this.options.levelMultiplier || typeof this.options.levelMultiplier === 'string'
                    ? this.options.levelMultiplier
                    : serialize(this.options.levelMultiplier)
        };
        return baseData;
    }
    get exemptPermissions() {
        return Array.isArray(this.options.exemptPermissions) && this.options.exemptPermissions.length
            ? this.options.exemptPermissions
            : this.manager.options.default.exemptPermissions;
    }
    get exemptMembersFunction() {
        return this.options.exemptMembers
            ? typeof this.options.exemptMembers === 'string' &&
              this.options.exemptMembers.includes('function anonymous')
                ? eval(`(${this.options.exemptMembers})`)
                : eval(this.options.exemptMembers)
            : null;
    }
    get exemptChannelsFunction() {
        return this.options.exemptChannels
            ? typeof this.options.exemptChannels === 'string' &&
              this.options.exemptChannels.includes('function anonymous')
                ? eval(`(${this.options.exemptChannels})`)
                : eval(this.options.exemptChannels)
            : null;
    }
    get xpAmountToAddFunction() {
        return this.options.xpAmountToAdd
            ? typeof this.options.xpAmountToAdd === 'string' &&
              this.options.xpAmountToAdd.includes('function anonymous')
                ? eval(`(${this.options.xpAmountToAdd})`)
                : eval(this.options.xpAmountToAdd)
            : null;
    }
    get voiceTimeToAddFunction() {
        return this.options.voiceTimeToAdd
            ? typeof this.options.voiceTimeToAdd === 'string' &&
              this.options.voiceTimeToAdd.includes('function anonymous')
                ? eval(`(${this.options.voiceTimeToAdd})`)
                : eval(this.options.voiceTimeToAdd)
            : null;
    }
    get levelMultiplierFunction() {
        return this.options.levelMultiplier
            ? typeof this.options.levelMultiplier === 'string' &&
              this.options.levelMultiplier.includes('function anonymous')
                ? eval(`(${this.options.levelMultiplier})`)
                : eval(this.options.levelMultiplier)
            : null;
    }
    async exemptMembers(member) {
        if (typeof this.exemptMembersFunction === 'function') {
            try {
                const result = await this.exemptMembersFunction(member);
                return result;
            } catch (err) {
                console.error(
                    `User Id: ${member.id}\nGuild Id: ${this.guildId}\nChannel Id: ${
                        member.voice.channel.id
                    }\n${serialize(this.exemptMembersFunction)}\n${err}`
                );
                return false;
            }
        }
        if (typeof this.manager.options.default.exemptMembers === 'function') {
            return await this.manager.options.default.exemptMembers(member);
        }
        return false;
    }
    async exemptChannels(channel) {
        if (typeof this.exemptChannelsFunction === 'function') {
            try {
                const result = await this.exemptChannelsFunction(channel);
                return result;
            } catch (err) {
                console.error(
                    `Guild Id: ${this.guildId}\nChannel Id: ${channel.id}\n${serialize(
                        this.exemptChannelsFunction
                    )}\n${err}`
                );
                return false;
            }
        }
        if (typeof this.manager.options.default.exemptChannels === 'function') {
            return await this.manager.options.default.exemptChannels(channel);
        }
        return false;
    }
    async xpAmountToAdd() {
        if (typeof this.xpAmountToAddFunction === 'function') {
            try {
                const result = await this.xpAmountToAddFunction();
                if (typeof result === 'number') return result;
                else return Math.floor(Math.random() * 10) + 1;
            } catch (err) {
                console.error(`xpAmountToAdd Config Error\n${serialize(this.xpAmountToAddFunction)}\n${err}`);
                return Math.floor(Math.random() * 10) + 1;
            }
        }
        if (typeof this.manager.options.default.xpAmountToAdd === 'function') {
            const result = await this.manager.options.default.xpAmountToAdd();
            if (typeof result === 'number') return result;
            else return Math.floor(Math.random() * 10) + 1;
        }
        return Math.floor(Math.random() * 10) + 1;
    }
    async voiceTimeToAdd() {
        if (typeof this.voiceTimeToAddFunction === 'function') {
            try {
                const result = await this.voiceTimeToAddFunction();
                if (typeof result === 'number') return result;
                else return 1000;
            } catch (err) {
                console.error(`voiceTimeToAdd Config Error\n${serialize(this.voiceTimeToAddFunction)}\n${err}`);
                return 1000;
            }
        }
        if (typeof this.manager.options.default.voiceTimeToAdd === 'function') {
            const result = await this.manager.options.default.voiceTimeToAdd();
            if (typeof result === 'number') return result;
            else return 1000;
        }
        return 1000;
    }
    async levelMultiplier() {
        if (typeof this.levelMultiplierFunction === 'function') {
            try {
                const result = await this.levelMultiplierFunction();
                if (typeof result === 'number') return result;
                else return 0.1;
            } catch (err) {
                console.error(`levelMultiplier Config Error\n${serialize(this.levelMultiplierFunction)}\n${err}`);
                return 0.1;
            }
        }
        if (typeof this.manager.options.default.levelMultiplier === 'function') {
            const result = await this.manager.options.default.levelMultiplier();
            if (typeof result === 'number') return result;
            else return 0.1;
        }
        return 0.1;
    }
    async checkMember(member) {
        const exemptMember = await this.exemptMembers(member);
        if (exemptMember) return false;
        const hasPermission = this.exemptPermissions.some((permission) => member.permissions.has(permission));
        if (hasPermission) return false;
        if (!this.trackBots && member.user.bot) return false;
        if (!this.trackMute && (member.voice.selfMute || member.voice.serverMute)) return false;
        if (!this.trackDeaf && (member.voice.selfDeaf || member.voice.serverDeaf)) return false;
        if (this.minXpToParticipate && member.data.data.levelingData.xp < this.minXpToParticipate) return false;
        if (this.minLevelToParticipate > 0 && member.data.data.levelingData.level < this.minLevelToParticipate)
            return false;
        if (this.maxXpToParticipate > 0 && member.data.data.levelingData.xp > this.maxXpToParticipate) return false;
        if (this.maxLevelToParticipate > 0 && member.data.data.levelingData.level > this.maxLevelToParticipate)
            return false;
        return true;
    }
    async checkChannel(channel) {
        const exemptChannel = await this.exemptChannels(channel);
        if (exemptChannel) return false;
        if (!this.trackAllChannels && !lodash._.includes(this.channelIds, channel.id)) return false;
        if (this.minUserCountToParticipate > 0 && channel.members.size < this.minUserCountToParticipate) return false;
        if (this.maxUserCountToParticipate > 0 && channel.members.size > this.maxUserCountToParticipate) return false;
        return true;
    }
    edit(options = {}) {
        return new Promise(async (resolve, reject) => {
            if (typeof options.trackBots === 'boolean') this.options.trackBots = options.trackBots;
            if (typeof options.trackAllChannels === 'boolean') this.options.trackAllChannels = options.trackAllChannels;
            if (typeof options.exemptChannels === 'string' && options.exemptChannels.includes('function anonymous'))
                this.options.exemptChannels = options.exemptChannels;
            if (Array.isArray(options.channelIds)) this.options.channelIds = options.channelIds;
            if (Array.isArray(options.exemptPermissions)) this.options.exemptPermissions = options.exemptPermissions;
            if (typeof options.exemptMembers === 'string' && options.exemptMembers.includes('function anonymous'))
                this.options.exemptMembers = options.exemptMembers;
            if (typeof options.trackMute === 'boolean') this.options.trackMute = options.trackMute;
            if (typeof options.trackDeaf === 'boolean') this.options.trackDeaf = options.trackDeaf;
            if (Number.isInteger(options.minUserCountToParticipate))
                this.options.minUserCountToParticipate = options.minUserCountToParticipate;
            if (Number.isInteger(options.maxUserCountToParticipate))
                this.options.maxUserCountToParticipate = options.maxUserCountToParticipate;
            if (Number.isInteger(options.minXpToParticipate))
                this.options.minXpToParticipate = options.minXpToParticipate;
            if (Number.isInteger(options.minLevelToParticipate))
                this.options.minLevelToParticipate = options.minLevelToParticipate;
            if (Number.isInteger(options.maxXpToParticipate))
                this.options.maxXpToParticipate = options.maxXpToParticipate;
            if (Number.isInteger(options.maxLevelToParticipate))
                this.options.maxLevelToParticipate = options.maxLevelToParticipate;
            if (typeof options.xpAmountToAdd === 'string' && options.xpAmountToAdd.includes('function anonymous'))
                this.options.xpAmountToAdd = options.xpAmountToAdd;
            if (typeof options.voiceTimeToAdd === 'string' && options.voiceTimeToAdd.includes('function anonymous'))
                this.options.voiceTimeToAdd = options.voiceTimeToAdd;
            if (typeof options.voiceTimeTrackingEnabled === 'boolean')
                this.options.voiceTimeTrackingEnabled = options.voiceTimeTrackingEnabled;
            if (typeof options.levelingTrackingEnabled === 'boolean')
                this.options.levelingTrackingEnabled = options.levelingTrackingEnabled;
            if (typeof options.levelMultiplier === 'string' && options.levelMultiplier.includes('function anonymous'))
                this.options.levelMultiplier = options.levelMultiplier;

            await this.manager.editGuild(this.guildId, this.guild.data);
            resolve(this);
        });
    }
}
module.exports = Config;
