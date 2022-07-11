const { EventEmitter } = require('node:events');
const { setInterval } = require('node:timers');
const { writeFile, readFile, access } = require('fs/promises');
const { deepmerge } = require('deepmerge-ts');
const serialize = require('serialize-javascript');
const Guild = require('./Guild.js');
const User = require('./User.js');
const Channel = require('./Channel.js');
const Discord = require('discord.js');
const {
    DEFAULT_CHECK_INTERVAL,
    VoiceManagerOptions,
    GuildOptions,
    UserOptions,
    ChannelOptions,
    GuildEditOptions,
    GuildData
} = require('./Constants.js');

/**
 * Voice Manager
 * @example
 * // Requires Manager from discord-voice
 * const { VoiceManager } = require("discord-voice");
 * // Create a new instance of the manager class
 * const manager = new VoiceManager(client, {
 * storage: './guilds.json',
 * deleteMissingGuilds: false,
 * default: {
 *   trackBots: false,
 *   trackAllChannels: true,
 * },
 * });
 * // We now have a voiceManager property to access the manager everywhere!
 * client.voiceManager = manager;
 */
class VoiceManager extends EventEmitter {
    /**
     * @param {Client} client The Discord Client
     * @param {VoiceManagerOptions} options The manager options
     */
    constructor(client, options, init = true) {
        super();
        if (!client?.options) throw new Error(`Client is a required option. (val=${client})`);
        /**
         * The Discord Client
         * @type {Client}
         */
        this.client = client;
        /**
         * Whether the manager is ready
         * @type {Boolean}
         */
        this.ready = false;
        /**
         * The guilds managed by this manager
         * @type {Collection<String, Guild>}
         */
        this.guilds = new Discord.Collection();
        /**
         * The manager options
         * @type {VoiceManagerOptions}
         */
        this.options = deepmerge(VoiceManagerOptions, options);

        if (init) this._init();
    }

    /**
     * Creates a new guild in the database
     *
     * @param {Snowflake} guildId The id of the guild to create
     * @param {GuildOptions} options The options for the guild
     *
     * @returns {Promise<Guild>}
     *
     * @example
     * client.voiceManager.create(interaction.guild.id, {
     *  users: [], // Array of user data's
     *  config: {
     *      trackBots: false, // If the user is a bot it will not be tracked.
     *      trackAllChannels: true, // All of the channels in the guild will be tracked.
     *      exemptChannels: () => false, // The user will not be tracked in these channels. (This is a function).
     *      channelIds: [], // The channel ids to track. (If trackAllChannels is true, this is ignored)
     *      exemptPermissions: [], // The user permissions to not track.
     *      exemptMembers: () => false, // The user will not be tracked. (This is a function).
     *      trackMute: true, // It will track users if they are muted aswell.
     *      trackDeaf: true, // It will track users if they are deafen aswell.
     *      minUserCountToParticipate: 0, // The min amount of users to be in a channel to be tracked.
     *      maxUserCountToParticipate: 0, // The max amount of users to be in a channel to be tracked.
     *      minXpToParticipate: 0, // The min amount of xp needed to be tracked.
     *      minLevelToParticipate: 0, // The min level needed to be tracked.
     *      maxXpToParticipate: 0, // The max amount of xp needed to be tracked.
     *      maxLevelToParticipate: 0, // The max level needed to be tracked.
     *      xpAmountToAdd: () => Math.floor(Math.random() * 10) + 1, // The amount of xp to add to the user (This is a function).
     *      voiceTimeToAdd: () => 1000, // The amount of time in ms to add to the user (This is a function).
     *      voiceTimeTrackingEnabled: true, // Whether the voiceTimeTracking module is enabled.
     *      levelingTrackingEnabled: true, // Whether the levelingTracking module is enabled.
     *      levelMultiplier: () => 0.1, // This will set level multiplier to 0.1 (This is a function).
     *  }
     * });
     */
    create(guildId, options) {
        return new Promise(async (resolve, reject) => {
            if (!this.ready) {
                return reject('The manager is not ready yet.');
            }

            if (!this.client.guilds.cache.has(guildId)) {
                return reject(`guildId is not a valid guild. (val=${guildId})`);
            }

            if (this.guilds.has(guildId)) {
                return resolve(this.guilds.get(guildId));
            }

            options = options && typeof options === 'object' ? deepmerge(UserOptions, options) : UserOptions;

            const guild = new Guild(this, guildId, options);

            this.guilds.set(guildId, guild);

            resolve(guild);
        });
    }

    /**
     * Edits the given guild's data.
     * @param {Snowflake} guildId The id of the guild to edit
     * @param {GuildEditOptions} [options={}] The edit options
     * @returns {Promise<Guild>} The edited guild
     *
     * @example
     * client.voiceManager.edit(interaction.guild.id, {
     *  config: {
     *      trackAllChannels: false, // All of the channels in the guild will not be tracked.
     *  }
     * });
     */
    edit(guildId, options) {
        return new Promise(async (resolve, reject) => {
            const guild = this.guilds.get(guildId);
            if (!guild) {
                return reject('No guild found with Id ' + guildId + '.');
            }

            guild.edit(options).then(resolve).catch(reject);
        });
    }

    /**
     * Deletes the given guild's data.
     * @param {Snowflake} guildId The id of the guild to delete
     * @returns {Promise<Guild>}
     */
    delete(guildId) {
        return new Promise(async (resolve, reject) => {
            const guild = this.guilds.get(guildId);
            if (!guild) {
                return reject('No guild found with Id ' + guildId + '.');
            }

            this.guilds.delete(guildId);
            await this.deleteGuild(guildId);

            resolve();
        });
    }

    /**
     * Saves the guild in the database
     * @ignore
     * @param {Snowflake} guildId The id of the guild to save
     * @param {GuildData} guildData The guild data to save
     */
    async saveGuild(guildId, guildData) {
        await writeFile(
            this.options.storage,
            JSON.stringify(
                this.guilds.map((guild) => guild.data),
                (_, v) => (typeof v === 'bigint' ? serialize(v) : v)
            ),
            'utf-8'
        );
        return;
    }

    /**
     * Edits the guild in the database
     * @ignore
     * @param {Snowflake} guildId The id of the guild to edit
     * @param {GuildData} guildData The guild data to save
     */
    async editGuild(guildId, options) {
        await writeFile(
            this.options.storage,
            JSON.stringify(
                this.guilds.map((guild) => guild.data),
                (_, v) => (typeof v === 'bigint' ? serialize(v) : v)
            ),
            'utf-8'
        );
        return;
    }

    /**
     * Deletes the guild from the database
     * @ignore
     * @param {Snowflake} guildId The id of the guild to delete
     * @param {GuildData} guildData The guild data to save
     */
    async deleteGuild(guildId) {
        await writeFile(
            this.options.storage,
            JSON.stringify(
                this.guilds.map((guild) => guild.data),
                (_, v) => (typeof v === 'bigint' ? serialize(v) : v)
            ),
            'utf-8'
        );
        return true;
    }

    /**
     * Gets the guilds from the storage file, or create it
     * @ignore
     * @returns {Promise<GuildData[]>}
     */
    async getAllGuilds() {
        const storageExists = await access(this.options.storage)
            .then(() => true)
            .catch(() => false);
        if (!storageExists) {
            await writeFile(this.options.storage, '[]', 'utf-8');
            return [];
        } else {
            const storageContent = await readFile(this.options.storage, { encoding: 'utf-8' });
            if (!storageContent.trim().startsWith('[') || !storageContent.trim().endsWith(']')) {
                console.log(storageContent);
                throw new SyntaxError('The storage file is not properly formatted (does not contain an array).');
            }

            try {
                return await JSON.parse(storageContent, (_, v) =>
                    typeof v === 'string' && /BigInt\("(-?\d+)"\)/.test(v) ? eval(v) : v
                );
            } catch (err) {
                if (err.message.startsWith('Unexpected token')) {
                    throw new SyntaxError(
                        `${err.message} | LINK: (${require('path').resolve(this.options.storage)}:1:${err.message
                            .split(' ')
                            .at(-1)})`
                    );
                }
                throw err;
            }
        }
    }

    /**
     * Inits the manager
     * @ignore
     */
    async _init() {
        let rawGuilds = await this.getAllGuilds();

        await (this.client.readyAt ? Promise.resolve() : new Promise((resolve) => this.client.once('ready', resolve)));
        if (this.client.shard && this.client.guilds.cache.size) {
            const shardId = Discord.ShardClientUtil.shardIdForGuildId(
                this.client.guilds.cache.first().id,
                this.client.shard.count
            );
            rawGuilds = rawGuilds.filter(
                (g) => shardId === Discord.ShardClientUtil.shardIdForGuildId(g.guildId, this.client.shard.count)
            );
        }

        rawGuilds.forEach((guild) => this.guilds.set(guild.guildId, new Guild(this, guild.guildId, guild)));

        setInterval(() => {
            if (this.client.readyAt) this._checkGuild.call(this);
        }, this.options.forceUpdateEvery || DEFAULT_CHECK_INTERVAL);

        this.ready = true;

        if (this.options.deleteMissingGuilds) {
            const missingGuilds = this.guilds.filter(
                async (guild) =>
                    !(this.client.guilds.cache.get(guild.guildId) ?? (await this.client.guilds.fetch(guild.guildId)))
            );
            for (const guild of missingGuilds) {
                this.guilds.delete(guild.guildId);
                await this.deleteGuild(guild.guildId);
            }
        }

        this.client.on('voiceStateUpdate', (oldState, newState) => this._handleVoiceStateUpdate(oldState, newState));
    }

    /**
     * Checks each guild and updates it if needed
     * @ignore
     */
    _checkGuild() {
        if (this.guilds.size <= 0) return;
        this.guilds.forEach((guild) => {
            if (!guild.config.voiceTimeTrackingEnabled) return;

            const membersInVoiceChannel = guild.guild.members.cache.filter((member) => member.voice.channel);

            if (!membersInVoiceChannel.size) return;

            membersInVoiceChannel.forEach(async (member) => {
                let user = guild.users.get(member.id);
                if (!user) {
                    user = new User(this, guild, member.id, UserOptions);
                    guild.users.set(member.id, user);
                }

                const voiceChannel = member.voice.channel;

                if (!((await guild.config.checkMember(member)) && (await guild.config.checkChannel(voiceChannel))))
                    return;

                if (user.channels.has(voiceChannel.id)) {
                    const channel = user.channels.get(voiceChannel.id);
                    channel.timeInChannel += (await guild.config.voiceTimeToAdd()) + 5000;
                } else {
                    const channel = new Channel(this, guild, voiceChannel.id, ChannelOptions);
                    user.channels.set(voiceChannel.id, channel);
                    channel.timeInChannel += (await guild.config.voiceTimeToAdd()) + 5000;
                }

                user.totalVoiceTime = user.channels.reduce((acc, cur) => acc + cur.timeInChannel, 0);

                if (guild.config.levelingTrackingEnabled) {
                    user.xp += await guild.config.xpAmountToAdd();
                    user.level = Math.floor((await guild.config.levelMultiplier()) * Math.sqrt(user.xp));
                }

                this.editGuild(guild.guildId, guild.data);
                return;
            });
        });
    }

    /**
     * @ignore
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */
    async _handleVoiceStateUpdate(oldState, newState) {
        if (newState.channel) {
            let guild = this.guilds.get(newState.guild.id);
            if (!guild) {
                guild = new Guild(this, newState.guild.id, GuildOptions);
                this.guilds.set(newState.guild.id, guild);
                await this.saveGuild(newState.guild.id, guild.data);
            }
        }
    }
}

module.exports = VoiceManager;
