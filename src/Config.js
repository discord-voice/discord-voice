const { Guild } = require('discord.js');
const { EventEmitter } = require('node:events');
const serialize = require('serialize-javascript');
const {
    ConfigData,
    ConfigEditOptions
} = require('./Constants.js');

/**
 * Represents a Config
 */
class Config extends EventEmitter {
    /**
     * @param {VoiceTimeManager} manager The Voice Manager
     * @param {Guild} guild The guild class
     * @param {ConfigData} options The config data
     */
    constructor(manager, guild, options) {
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
         * The config data.
         * @type {ConfigData}
         */
        this.options = options;
    }

    /**
     * Whether bots are able to be tracked.
     * @type {Boolean}
     */
    get trackBots() {
        return this.options.trackBots || this.manager.options.default.trackBots;
    }

    /**
     * Whether to track all of the guild's voice channels.
     * @type {Boolean}
     */
    get trackMute() {
        return this.options.trackMute || this.manager.options.default.trackMute;
    }

    /**
     * Whether members who are deafened should be tracked.
     * @type {Boolean}
     */
    get trackDeaf() {
        return this.options.trackDeaf || this.manager.options.default.trackDeaf;
    }

    /**
     * Whether all of the guild's voice channels should be tracked.
     * @type {Boolean}
     */
    get trackAllChannels() {
        return this.options.trackAllChannels || this.manager.options.default.trackAllChannels;
    }

    /**
     * The channels to track (if trackAllChannels is true this will be ignored).
     * @type {Snowflake[]}
     */
    get channelIds() {
        return this.options.channelIds || this.manager.options.default.channelIds;
    }

    /**
     * The min amount of users to be in a channel to be tracked (0 is equal to no limit).
     * @type {Number}
     */
    get minUserCountToParticipate() {
        return this.options.minUserCountToParticipate || this.manager.options.default.minUserCountToParticipate;
    }

    /**
     * The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
     * @type {Number}
     */
    get maxUserCountToParticipate() {
        return this.options.maxUserCountToParticipate || this.manager.options.default.maxUserCountToParticipate;
    }

    /**
     * The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
     * @type {Number}
     */
    get minXpToParticipate() {
        return this.options.minXpToParticipate || this.manager.options.default.minXpToParticipate;
    }

    /**
     * The min amount of level the user needs to have to be tracked (0 is equal to no limit).
     * @type {Number}
     */
    get minLevelToParticipate() {
        return this.options.minLevelToParticipate || this.manager.options.default.minLevelToParticipate;
    }

    /**
     * The max amount of xp the user can be tracked uptil (0 is equal to no limit).
     * @type {Number}
     */
    get maxXpToParticipate() {
        return this.options.maxXpToParticipate || this.manager.options.default.maxXpToParticipate;
    }

    /**
     * The max amount of level the user can be tracked uptil (0 is equal to no limit).
     * @type {Number}
     */
    get maxLevelToParticipate() {
        return this.options.maxLevelToParticipate || this.manager.options.default.maxLevelToParticipate;
    }

    /**
     * Whether the voice time tracking module is enabled.
     * @type {Boolean}
     */
    get voiceTimeTrackingEnabled() {
        return this.options.voiceTimeTrackingEnabled || this.manager.options.default.voiceTimeTrackingEnabled;
    }

    /**
     * Whether the leveling tracking module is enabled.
     * @type {Boolean}
     */
    get levelingTrackingEnabled() {
        return this.options.levelingTrackingEnabled || this.manager.options.default.levelingTrackingEnabled;
    }

    /**
     * Members with any of these permissions won't be tracked.
     * @type {PermissionResolvable[]}
     */
    get exemptPermissions() {
        return Array.isArray(this.options.exemptPermissions) && this.options.exemptPermissions.length
            ? this.options.exemptPermissions
            : this.manager.options.default.exemptPermissions;
    }

    /**
     * The raw config data object.
     * @type {ConfigData}
     */
    get data() {
        const baseData = {
            guildId: this.guildId,
            trackBots: this.trackBots,
            trackAllChannels: this.trackAllChannels,
            exemptChannels:
                !this.options.exemptChannels || typeof this.options.exemptChannels === 'string'
                    ? this.options.exemptChannels
                    : serialize(this.options.exemptChannels),
            channelIds: this.channelIds,
            exemptPermissions: this.exemptPermissions,
            exemptMembers:
                !this.options.exemptMembers || typeof this.options.exemptMembers === 'string'
                    ? this.options.exemptMembers
                    : serialize(this.options.exemptMembers),
            trackMute: this.trackMute,
            trackDeaf: this.trackDeaf,
            minUserCountToParticipate: this.minUserCountToParticipate,
            maxUserCountToParticipate: this.maxUserCountToParticipate,
            minXpToParticipate: this.minXpToParticipate,
            minLevelToParticipate: this.minLevelToParticipate,
            maxXpToParticipate: this.maxXpToParticipate,
            maxLevelToParticipate: this.maxLevelToParticipate,
            xpAmountToAdd:
                !this.options.xpAmountToAdd || typeof this.options.xpAmountToAdd === 'string'
                    ? this.options.xpAmountToAdd
                    : serialize(this.options.xpAmountToAdd),
            voiceTimeToAdd:
                !this.options.voiceTimeToAdd || typeof this.options.voiceTimeToAdd === 'string'
                    ? this.options.voiceTimeToAdd
                    : serialize(this.options.voiceTimeToAdd),
            voiceTimeTrackingEnabled: this.voiceTimeTrackingEnabled,
            levelingTrackingEnabled: this.levelingTrackingEnabled,
            levelMultiplier:
                !this.options.levelMultiplier || typeof this.options.levelMultiplier === 'string'
                    ? this.options.levelMultiplier
                    : serialize(this.options.levelMultiplier)
        };
        return baseData;
    }

    /**
     * The exemptMembers function
     * @type {?Function}
     */
    get exemptMembersFunction() {
        return this.options.exemptMembers
            ? typeof this.options.exemptMembers === 'string' &&
              this.options.exemptMembers.includes('function anonymous')
                ? eval(`(${this.options.exemptMembers})`)
                : eval(this.options.exemptMembers)
            : null;
    }

    /**
     * The exemptChannels function
     * @type {?Function}
     */
    get exemptChannelsFunction() {
        return this.options.exemptChannels
            ? typeof this.options.exemptChannels === 'string' &&
              this.options.exemptChannels.includes('function anonymous')
                ? eval(`(${this.options.exemptChannels})`)
                : eval(this.options.exemptChannels)
            : null;
    }

    /**
     * The xpAmountToAdd function
     * @type {?Function}
     */
    get xpAmountToAddFunction() {
        return this.options.xpAmountToAdd
            ? typeof this.options.xpAmountToAdd === 'string' &&
              this.options.xpAmountToAdd.includes('function anonymous')
                ? eval(`(${this.options.xpAmountToAdd})`)
                : eval(this.options.xpAmountToAdd)
            : null;
    }

    /**
     * The voiceTimeToAdd function
     * @type {?Function}
     */
    get voiceTimeToAddFunction() {
        return this.options.voiceTimeToAdd
            ? typeof this.options.voiceTimeToAdd === 'string' &&
              this.options.voiceTimeToAdd.includes('function anonymous')
                ? eval(`(${this.options.voiceTimeToAdd})`)
                : eval(this.options.voiceTimeToAdd)
            : null;
    }

    /**
     * The levelMultiplier function
     * @type {?Function}
     */
    get levelMultiplierFunction() {
        return this.options.levelMultiplier
            ? typeof this.options.levelMultiplier === 'string' &&
              this.options.levelMultiplier.includes('function anonymous')
                ? eval(`(${this.options.levelMultiplier})`)
                : eval(this.options.levelMultiplier)
            : null;
    }

    /**
     * Function to filter members. If true is returned, the member won't be tracked.
     * @property {GuildMember} member The member to check
     * @returns {Promise<Boolean>}
     */
    async exemptMembers(member) {
        if (typeof this.exemptMembersFunction === 'function') {
            try {
                const result = await this.exemptMembersFunction(member, this);
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
            return await this.manager.options.default.exemptMembers(member, this);
        }
        return false;
    }

    /**
     * Function to filter channels. If true is returned, the channel won't be tracked.
     * @returns {Promise<Number>}
     */
    async exemptChannels(channel) {
        if (typeof this.exemptChannelsFunction === 'function') {
            try {
                const result = await this.exemptChannelsFunction(channel, this);
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
            return await this.manager.options.default.exemptChannels(channel, this);
        }
        return false;
    }

    /**
     * Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
     * @returns {Promise<Number>}
     */
    async xpAmountToAdd() {
        if (typeof this.xpAmountToAddFunction === 'function') {
            try {
                const result = await this.xpAmountToAddFunction(this);
                if (typeof result === 'number') return result;
                else return Math.floor(Math.random() * 10) + 1;
            } catch (err) {
                console.error(`xpAmountToAdd Config Error\n${serialize(this.xpAmountToAddFunction)}\n${err}`);
                return Math.floor(Math.random() * 10) + 1;
            }
        }
        if (typeof this.manager.options.default.xpAmountToAdd === 'function') {
            const result = await this.manager.options.default.xpAmountToAdd(this);
            if (typeof result === 'number') return result;
            else return Math.floor(Math.random() * 10) + 1;
        }
        return Math.floor(Math.random() * 10) + 1;
    }

    /**
     * Function for voiceTimeToAdd. If not provided, the default value is used (1000).
     * @returns {Promise<Number>}
     */
    async voiceTimeToAdd() {
        if (typeof this.voiceTimeToAddFunction === 'function') {
            try {
                const result = await this.voiceTimeToAddFunction(this);
                if (typeof result === 'number') return result;
                else return 1000;
            } catch (err) {
                console.error(`voiceTimeToAdd Config Error\n${serialize(this.voiceTimeToAddFunction)}\n${err}`);
                return 1000;
            }
        }
        if (typeof this.manager.options.default.voiceTimeToAdd === 'function') {
            const result = await this.manager.options.default.voiceTimeToAdd(this);
            if (typeof result === 'number') return result;
            else return 1000;
        }
        return 1000;
    }

    /**
     * Function for levelMultiplier. If not provided, the default value is used (0.1).
     * @returns {Promise<Number>}
     */
    async levelMultiplier() {
        if (typeof this.levelMultiplierFunction === 'function') {
            try {
                const result = await this.levelMultiplierFunction(this);
                if (typeof result === 'number') return result;
                else return 0.1;
            } catch (err) {
                console.error(`levelMultiplier Config Error\n${serialize(this.levelMultiplierFunction)}\n${err}`);
                return 0.1;
            }
        }
        if (typeof this.manager.options.default.levelMultiplier === 'function') {
            const result = await this.manager.options.default.levelMultiplier(this);
            if (typeof result === 'number') return result;
            else return 0.1;
        }
        return 0.1;
    }

    /**
     * Function to check if the member is exempt from xp tracking.
     * @param {Member} member The member to check
     * @returns {Promise<Boolean>}
     */
    async checkMember(member) {
        const exemptMember = await this.exemptMembers(member, this);
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

    /**
     * Function to check if the channel is exempt from xp tracking.
     * @param {VoiceChannel} channel The channel to check
     * @returns {Promise<Boolean>}
     */
    async checkChannel(channel) {
        const exemptChannel = await this.exemptChannels(channel, this);
        if (exemptChannel) return false;
        if (!this.trackAllChannels && !this.channelIds.includes(channel.id)) return false;
        if (this.minUserCountToParticipate > 0 && channel.members.size < this.minUserCountToParticipate) return false;
        if (this.maxUserCountToParticipate > 0 && channel.members.size > this.maxUserCountToParticipate) return false;
        return true;
    }

    /**
     * Edits the config
     * @param {ConfigEditOptions} options The edit options
     * @returns {Promise<Config>}
     */
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
