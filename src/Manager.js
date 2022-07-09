const { EventEmitter } = require("node:events");
const { setInterval } = require("node:timers");
const { writeFile, readFile, access } = require("fs/promises");
const { deepmerge } = require("deepmerge-ts");
const serialize = require("serialize-javascript");
const Guild = require("./Guild.js");
const User = require("./User.js");
const Channel = require("./Channel.js");
const Discord = require("discord.js");
const {
    defaultVoiceManagerOptions,
    defaultGuildOptions,
    defaultUserOptions,
    defaultChannelOptions,
    DEFAULT_CHECK_INTERVAL
} = require('./Constants.js');
class VoiceManager extends EventEmitter {
    constructor(client, options, init = true) {
        super();
        if (!client?.options) throw new Error(`Client is a required option. (val=${client})`);
        this.client = client;
        this.ready = false;

        this.guilds = new Discord.Collection();
        this.options = deepmerge(defaultVoiceManagerOptions, options);
        if (init) this._init();
    }

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

            options =
                options && typeof options === 'object' ? deepmerge(defaultUserOptions, options) : defaultUserOptions;

            const guild = new Guild(this, guildId, options);

            this.guilds.set(guildId, guild);

            resolve(guild);
        });
    }

    edit(guildId, options) {
        return new Promise(async (resolve, reject) => {
            const guild = this.guilds.get(guildId);
            if (!guild) {
                return reject('No guild found with Id ' + guildId + '.');
            }

            guild.edit(options).then(resolve).catch(reject);
        });
    }

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
            const missingGuilds = this.guilds.filter((guild) => !this.client.guilds.cache.has(guild.guildId));
            for (const guild of missingGuilds) {
                this.guilds.delete(guild.guildId);
                await this.deleteGuild(guild.guildId);
            }
        }

        this.client.on('voiceStateUpdate', (oldState, newState) => this._handleVoiceStateUpdate(oldState, newState));
    }

    _checkGuild() {
        if (this.guilds.size <= 0) return;
        this.guilds.forEach((guild) => {
            if (!guild.config.voiceTimeTrackingEnabled) return;

            const membersInVoiceChannel = guild.guild.members.cache.filter((member) => member.voice.channel);

            if (!membersInVoiceChannel.size) return;

            membersInVoiceChannel.forEach(async (member) => {
                let user = guild.users.get(member.id);
                if (!user) {
                    user = new User(this, guild, member.id, defaultUserOptions);
                    guild.users.set(member.id, user);
                }

                const voiceChannel = member.voice.channel;

                if (!((await guild.config.checkMember(member)) && (await guild.config.checkChannel(voiceChannel))))
                    return;

                if (user.channels.has(voiceChannel.id)) {
                    const channel = user.channels.get(voiceChannel.id);
                    channel.timeInChannel += await guild.config.voiceTimeToAdd();
                } else {
                    const channel = new Channel(this, guild, voiceChannel.id, defaultChannelOptions);
                    user.channels.set(voiceChannel.id, channel);
                    channel.timeInChannel += await guild.config.voiceTimeToAdd();
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
    async _handleVoiceStateUpdate(oldState, newState) {
        if (newState.channel) {
            let guild = this.guilds.get(newState.guild.id);
            if (!guild) {
                guild = new Guild(this, newState.guild.id, defaultGuildOptions);
                this.guilds.set(newState.guild.id, guild);
                await this.saveGuild(newState.guild.id, guild.data);
            }
        }
    }
}

module.exports = VoiceManager;
