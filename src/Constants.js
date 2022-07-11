exports.DEFAULT_CHECK_INTERVAL = 5000;

/**
 * The voice manager options.
 * @typedef VoiceManagerOptions
 *
 * @property {string} [storage="./guilds.json"] The storage path for the guild's data.
 * @property {boolean} [deleteMissingGuilds=false] Whether to delete guilds data that are no longer in the client.
 * @property {ConfigOptions} [default] The default config options.
 * @property {boolean} [default.trackBots=false] Whether bots are able to be tracked.
 * @property {boolean} [default.trackAllChannels=true] Whether to track all of the guild's voice channels.
 * @property {function} [default.exemptChannels] Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Snowflake[]} [default.channelIds=[]] The channels to track (if trackAllChannels is true this will be ignored).
 * @property {PermissionResolvable[]} [default.exemptPermissions=[]] Members with any of these permissions won't be tracked.
 * @property {function} [default.exemptMembers] Function to filter members. If true is returned, the member won't be tracked.
 * @property {boolean} [default.trackMute=true] Whether members who are muted should be tracked.
 * @property {boolean} [default.trackDeaf=true] Whether members who are deafened should be tracked.
 * @property {number} [default.minUserCountToParticipate="0"] The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {number} [default.maxUserCountToParticipate="0"] The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {number} [default.minXpToParticipate="0"] The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [default.minLevelToParticipate="0"] The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [default.maxXpToParticipate="0"] The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {number} [default.maxLevelToParticipate="0"] The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {function} [default.xpAmountToAdd] Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {function} [default.voiceTimeToAdd] Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {boolean} [defaul.voiceTimeTrackingEnabled=true] Whether to enable the voice time tracking module.
 * @property {boolean} [default.levelingTrackingEnabled=true] Whether to enable the leveling tracking module.
 * @property {function} [default.levelMultiplier] Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
exports.VoiceManagerOptions = {
    storage: './guilds.json',
    deleteMissingGuilds: false,
    default: {
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
    }
};

/**
 * The guild options.
 * @typedef GuildOptions
 *
 * @property {UserOptions[]} [users] The users stored in the guild.
 * @property {ConfigOptions} [config] The config options.
 * @property {boolean} [config.trackBots=false] Whether bots are able to be tracked.
 * @property {boolean} [config.trackAllChannels=true] Whether to track all of the guild's voice channels.
 * @property {function} [config.exemptChannels] Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Discord.Snowflake[]} [config.channelIds=[]] The channels to track (if trackAllChannels is true this will be ignored).
 * @property {Discord.PermissionResolvable[]} [config.exemptPermissions=[]] Members with any of these permissions won't be tracked.
 * @property {function} [config.exemptMembers] Function to filter members. If true is returned, the member won't be tracked.
 * @property {boolean} [config.trackMute=true] Whether members who are muted should be tracked.
 * @property {boolean} [config.trackDeaf=true] Whether members who are deafened should be tracked.
 * @property {number} [config.minUserCountToParticipate="0"] The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {number} [config.maxUserCountToParticipate="0"] The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {number} [config.minXpToParticipate="0"] The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [config.minLevelToParticipate="0"] The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [config.maxXpToParticipate="0"] The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {number} [config.maxLevelToParticipate="0"] The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {function} [config.xpAmountToAdd] Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {function} [config.voiceTimeToAdd] Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {boolean} [config.voiceTimeTrackingEnabled=true] Whether to enable the voice time tracking module.
 * @property {boolean} [config.levelingTrackingEnabled=true] Whether to enable the leveling tracking module.
 * @property {function} [config.levelMultiplier] Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
exports.GuildOptions = {
    users: [],
    config: {
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
    }
};

/**
 * The user options.
 * @typedef UserOptions
 *
 * @property {ChannelOptions[]} [channels] The channels stored in the user.
 * @property {Number} [totalVoiceTime] The total voice time of the user.
 * @property {Number} [xp] The xp of the user.
 * @property {Number} [level] The level of the user.
 */
exports.UserOptions = {
    channels: [],
    totalVoiceTime: 0,
    xp: 0,
    level: 0
};

/**
 * The channel options.
 * @typedef ChannelOptions
 * 
 * @property {Number} [totalVoiceTime] The total voice time spent in the channel.
 */
exports.ChannelOptions = {
    timeInChannel: 0
};

/**
 * The config options.
 * @typedef ConfigOptions
 * 
 * @property {boolean} [trackBots=false] Whether bots are able to be tracked.
 * @property {boolean} [trackAllChannels=true] Whether to track all of the guild's voice channels.
 * @property {function} [exemptChannels] Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Discord.Snowflake[]} [channelIds=[]] The channels to track (if trackAllChannels is true this will be ignored).
 * @property {Discord.PermissionResolvable[]} [exemptPermissions=[]] Members with any of these permissions won't be tracked.
 * @property {function} [exemptMembers] Function to filter members. If true is returned, the member won't be tracked.
 * @property {boolean} [trackMute=true] Whether members who are muted should be tracked.
 * @property {boolean} [trackDeaf=true] Whether members who are deafened should be tracked.
 * @property {number} [minUserCountToParticipate="0"] The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {number} [maxUserCountToParticipate="0"] The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {number} [minXpToParticipate="0"] The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [minLevelToParticipate="0"] The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [maxXpToParticipate="0"] The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {number} [maxLevelToParticipate="0"] The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {function} [xpAmountToAdd] Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {function} [voiceTimeToAdd] Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {boolean} [voiceTimeTrackingEnabled=true] Whether to enable the voice time tracking module.
 * @property {boolean} [levelingTrackingEnabled=true] Whether to enable the leveling tracking module.
 * @property {function} [levelMultiplier] Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
exports.ConfigOptions = {
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
 * The guild edit method options.
 * @typedef GuildEditOptions
 * 
 * @property {UserOptions[]} [users] The users stored in the guild.
 * @property {ConfigOptions} [config] The config options.
 * @property {boolean} [config.trackBots=false] Whether bots are able to be tracked.
 * @property {boolean} [config.trackAllChannels=true] Whether to track all of the guild's voice channels.
 * @property {function} [config.exemptChannels] Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Discord.Snowflake[]} [config.channelIds=[]] The channels to track (if trackAllChannels is true this will be ignored).
 * @property {Discord.PermissionResolvable[]} [config.exemptPermissions=[]] Members with any of these permissions won't be tracked.
 * @property {function} [config.exemptMembers] Function to filter members. If true is returned, the member won't be tracked.
 * @property {boolean} [config.trackMute=true] Whether members who are muted should be tracked.
 * @property {boolean} [config.trackDeaf=true] Whether members who are deafened should be tracked.
 * @property {number} [config.minUserCountToParticipate="0"] The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {number} [config.maxUserCountToParticipate="0"] The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {number} [config.minXpToParticipate="0"] The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [config.minLevelToParticipate="0"] The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [config.maxXpToParticipate="0"] The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {number} [config.maxLevelToParticipate="0"] The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {function} [config.xpAmountToAdd] Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {function} [config.voiceTimeToAdd] Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {boolean} [config.voiceTimeTrackingEnabled=true] Whether to enable the voice time tracking module.
 * @property {boolean} [config.levelingTrackingEnabled=true] Whether to enable the leveling tracking module.
 * @property {function} [config.levelMultiplier] Function for levelMultiplier. If not provided, the default value is used (0.1).
 */ 
exports.GuildEditOptions = {
    users: [],
    config: {
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
    }
};

/**
 * Raw guild object (used to store guilds in the database).
 * @typedef GuildData
 * 
 * @property {Discord.Snowflake} guildId The guild's id.
 * @property {UserData[]} users The users stored in the guild.
 * @property {ConfigData} config The config of the guild.
 */
exports.GuildData = {};