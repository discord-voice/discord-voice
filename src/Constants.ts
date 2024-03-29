import {
    PermissionResolvable,
    GuildMember,
    GuildChannel
} from 'discord.js';
import Config from './Config';

export const DEFAULT_CHECK_INTERVAL = 5000;

/**
 * The voice manager options.
 * @typedef {object} VoiceManagerOptions
 *
 * @property {string} [storage="./guilds.json"] The storage path for the guild's data.
 * @property {number} [forceUpdateEvery=null] The interval to force update the guild's data.
 * @property {Boolean} [deleteMissingGuilds=false] Whether to delete guilds data that are no longer in the client.
 * @property {DefaultConfigOptions} [default] The default config options.
 */
export const VoiceManagerOptions = {
    storage: './guilds.json',
    forceUpdateEvery: null,
    deleteMissingGuilds: false,
    default: {
        trackBots: false,
        trackAllChannels: true,
        exemptChannels: (_channel: GuildChannel, _config: Config) => false,
        channelIds: [],
        exemptPermissions: [],
        exemptMembers: (_member: GuildMember, _config: Config) => false,
        trackMute: true,
        trackDeaf: true,
        minUserCountToParticipate: 0,
        maxUserCountToParticipate: 0,
        minXpToParticipate: 0,
        minLevelToParticipate: 0,
        maxXpToParticipate: 0,
        maxLevelToParticipate: 0,
        xpAmountToAdd: (_member: GuildMember, _config: Config) => Math.floor(Math.random() * 10) + 1,
        voiceTimeToAdd: (_config: Config) => 1000,
        voiceTimeTrackingEnabled: true,
        levelingTrackingEnabled: true,
        levelMultiplier: (_config: Config) => 0.1
    }
};

/**
 * The guild edit method options.
 * @typedef {object} GuildEditOptions
 *
 * @property {UserData[]} [users] The users stored in the guild.
 * @property {ConfigData} [config] The config data.
 * @property {any} [extraData] The extra data for this guild.
 */
export interface GuildEditOptions {
    users?: UserData[];
    config?: ConfigData;
    extraData?: any;
};

/**
 * The user edit method options.
 * @typedef {object} UserEditOptions
 *
 * @property {ChannelData[]} [channels] The channels stored in the user.
 * @property {Number} [totalVoiceTime] The total voice time of the user.
 * @property {Number} [xp] The xp of the user.
 * @property {Number} [level] The level of the user.
 */
export interface UserEditOptions {
    channels?: ChannelData[];
    totalVoiceTime?: number;
    xp?: number;
    level?: number;
};

/**
 * The channel edit method options.
 * @typedef {object} ChannelEditOptions
 *
 * @property {Number} [timeInChannel] The voice time spent in the channel.
 */
export interface ChannelEditOptions {
    timeInChannel?: number;
};

/**
 * The config edit method options.
 * @typedef {object} ConfigEditOptions
 *
 * @property {Boolean} [trackBots=false] Whether bots are able to be tracked.
 * @property {Boolean} [trackAllChannels=true] Whether to track all of the guild's voice channels.
 * @property {ExemptChannelsFunction} [exemptChannels] Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Snowflake[]} [channelIds=[]] The channels to track (if trackAllChannels is true this will be ignored).
 * @property {PermissionResolvable[]} [exemptPermissions=[]] Members with any of these permissions won't be tracked.
 * @property {ExemptMembersFunction} [exemptMembers] Function to filter members. If true is returned, the member won't be tracked.
 * @property {Boolean} [trackMute=true] Whether members who are muted should be tracked.
 * @property {Boolean} [trackDeaf=true] Whether members who are deafened should be tracked.
 * @property {Number} [minUserCountToParticipate="0"] The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {Number} [maxUserCountToParticipate="0"] The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {Number} [minXpToParticipate="0"] The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {Number} [minLevelToParticipate="0"] The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {Number} [maxXpToParticipate="0"] The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {Number} [maxLevelToParticipate="0"] The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {XPAmountToAddFunction} [xpAmountToAdd] Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {VoiceTimeToAddFunction} [voiceTimeToAdd] Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {Boolean} [voiceTimeTrackingEnabled=true] Whether to enable the voice time tracking module.
 * @property {Boolean} [levelingTrackingEnabled=true] Whether to enable the leveling tracking module.
 * @property {LevelMultiplierFunction} [levelMultiplier] Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
export interface ConfigEditOptions {
    trackBots?: boolean;
    trackAllChannels?: boolean;
    exemptChannels?: (channel: GuildChannel, config: Config) => Promise<boolean> | boolean;
    channelIds?: string[];
    exemptPermissions?: PermissionResolvable[];
    exemptMembers?: (member: GuildMember, config: Config) => Promise<boolean> | boolean;
    trackMute?: boolean;
    trackDeaf?: boolean;
    minUserCountToParticipate?: number;
    maxUserCountToParticipate?: number;
    minXpToParticipate?: number;
    minLevelToParticipate?: number;
    maxXpToParticipate?: number;
    maxLevelToParticipate?: number;
    xpAmountToAdd?: (member: GuildMember, config: Config) => Promise<number> | number;
    voiceTimeToAdd?: (config: Config) => Promise<number> | number;
    voiceTimeTrackingEnabled?: boolean;
    levelingTrackingEnabled?: boolean;
    levelMultiplier?: (config: Config) => Promise<number> | number;
};

/**
 * Raw guild object (used to store guilds in the database).
 * @typedef {object} GuildData
 *
 * @property {Snowflake} guildId The guild's id.
 * @property {UserData[]} users The users stored in the guild.
 * @property {ConfigData} config The config of the guild.
 * @property {any} [extraData] The extra data for this guild.
 */
export interface GuildData {
    guildId: string;
    users: UserData[];
    config: ConfigData;
    extraData?: any;
};

/**
 * Raw user object (used to store users in the database).
 * @typedef {object} UserData
 *
 * @property {Snowflake} guildId The user's guild id.
 * @property {Snowflake} userId The user's id.
 * @property {ChannelData[]} channels The channels the user has spent voice time in.
 * @property {Number} totalVoiceTime The total amount of voice time the user has.
 * @property {Number} xp The amount of xp the user has.
 * @property {Number} level The amount of level the user has.
 */
export interface UserData {
    guildId: string;
    userId: string;
    channels: ChannelData[];
    totalVoiceTime: number;
    xp: number;
    level: number;
};

/**
 * Raw channel object (used to store channels in the database).
 * @typedef {object} ChannelData
 *
 * @property {Snowflake} guildId The channel's guild id.
 * @property {Snowflake} channelId The channel's id.
 * @property {Number} timeInChannel The total amount of voice time the user has spent in this channel.
 */
export interface ChannelData {
    guildId: string;
    channelId: string;
    timeInChannel: number;
};

/**
 * Raw config object (used to store config's in the database).
 * @typedef {object} ConfigData
 *
 * @property {Snowflake} guildId The config's guild id.
 * @property {Boolean} trackBots Whether bots are able to be tracked.
 * @property {Boolean} trackAllChannels Whether to track all of the guild's voice channels.
 * @property {ExemptChannelsFunction} exemptChannels Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Snowflake[]} channelIds The channels to track (if trackAllChannels is true this will be ignored).
 * @property {PermissionResolvable[]} exemptPermissions Members with any of these permissions won't be tracked.
 * @property {ExemptMembersFunction} exemptMembers Function to filter members. If true is returned, the member won't be tracked.
 * @property {Boolean} trackMute Whether members who are muted should be tracked.
 * @property {Boolean} trackDeaf Whether members who are deafened should be tracked.
 * @property {Number} minUserCountToParticipate The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {Number} maxUserCountToParticipate The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {Number} minXpToParticipate The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {Number} minLevelToParticipate The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {Number} maxXpToParticipate The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {Number} maxLevelToParticipate The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {XPAmountToAddFunction} xpAmountToAdd Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {VoiceTimeToAddFunction} voiceTimeToAdd Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {Boolean} voiceTimeTrackingEnabled Whether to enable the voice time tracking module.
 * @property {Boolean} levelingTrackingEnabled Whether to enable the leveling tracking module.
 * @property {LevelMultiplierFunction} levelMultiplier Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
export interface ConfigData {
    guildId: string;
    trackBots: boolean;
    trackAllChannels: boolean;
    exemptChannels: string | ((channel: GuildChannel, config: Config) => Promise<boolean> | boolean);
    channelIds: string[];
    exemptPermissions: PermissionResolvable[];
    exemptMembers: string | ((member: GuildMember, config: Config) => Promise<boolean> | boolean);
    trackMute: boolean;
    trackDeaf: boolean;
    minUserCountToParticipate: number;
    maxUserCountToParticipate: number;
    minXpToParticipate: number;
    minLevelToParticipate: number;
    maxXpToParticipate: number;
    maxLevelToParticipate: number;
    xpAmountToAdd: string | ((member: GuildMember, config: Config) => Promise<number> | number);
    voiceTimeToAdd: string | ((config: Config) => Promise<number> | number);
    voiceTimeTrackingEnabled: boolean;
    levelingTrackingEnabled: boolean;
    levelMultiplier: string | ((config: Config) => Promise<number> | number);
};

/**
 * The default config options.
 * @typedef {object} DefaultConfigOptions
 *
 * @property {Boolean} [trackBots=false] Whether bots are able to be tracked.
 * @property {Boolean} [trackAllChannels=true] Whether to track all of the guild's voice channels.
 * @property {ExemptChannelsFunction} [exemptChannels] Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Snowflake[]} [channelIds=[]] The channels to track (if trackAllChannels is true this will be ignored).
 * @property {PermissionResolvable[]} [exemptPermissions=[]] Members with any of these permissions won't be tracked.
 * @property {ExemptMembersFunction} [exemptMembers] Function to filter members. If true is returned, the member won't be tracked.
 * @property {Boolean} [trackMute=true] Whether members who are muted should be tracked.
 * @property {Boolean} [trackDeaf=true] Whether members who are deafened should be tracked.
 * @property {Number} [minUserCountToParticipate="0"] The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {Number} [maxUserCountToParticipate="0"] The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {Number} [minXpToParticipate="0"] The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {Number} [minLevelToParticipate="0"] The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {Number} [maxXpToParticipate="0"] The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {Number} [maxLevelToParticipate="0"] The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {XPAmountToAddFunction} [xpAmountToAdd] Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {VoiceTimeToAddFunction} [voiceTimeToAdd] Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {Boolean} [voiceTimeTrackingEnabled=true] Whether to enable the voice time tracking module.
 * @property {Boolean} [levelingTrackingEnabled=true] Whether to enable the leveling tracking module.
 * @property {LevelMultiplierFunction} [levelMultiplier] Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
export const DefaultConfigOptions = {
    trackBots: false,
    trackAllChannels: true,
    exemptChannels: () => false,
    channelIds: [],
    exemptPermissions: [],
    exemptMembers: () => false,
    trackMute: true,
    trackDeaf: true,
    minUserCountToParticipate: 0,
    maxUserCountToParticipate: 0,
    minXpToParticipate: 0,
    minLevelToParticipate: 0,
    maxXpToParticipate: 0,
    maxLevelToParticipate: 0,
    xpAmountToAdd: () => Math.floor(Math.random() * 10) + 1,
    voiceTimeToAdd: () => 1000,
    voiceTimeTrackingEnabled: true,
    levelingTrackingEnabled: true,
    levelMultiplier: () => 0.1
};

/**
 * @typedef {Function} ExemptChannelsFunction
 *
 * @param {GuildChannel} channel
 * @param {Config} config
 * @returns {Promise<boolean>|boolean}
 */

/**
 * @typedef {Function} ExemptMembersFunction
 *
 * @param {GuildMember} member
 * @param {Config} config
 * @returns {Promise<boolean>|boolean}
 */

/**
 * @typedef {Function} XPAmountToAddFunction
 *
 * @param {Config} config
 * @returns {Promise<number>|number}
 */

/**
 * @typedef {Function} VoiceTimeToAddFunction
 *
 * @param {Config} config
 * @returns {Promise<number>|number}
 */

/**
 * @typedef {Function} LevelMultiplierFunction
 *
 * @param {Config} config
 * @returns {Promise<number>|number}
 */