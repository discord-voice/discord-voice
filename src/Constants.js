const Discord = require("discord.js");
/**
 * The voice manager options
 * @typedef {object} VoiceManagerOptions
 *
 * @property {string} [userStorage="./users.json"] The storage path for the user's data.
 * @property {string} [configStorage="./configs.json"] The storage path for the config's data.
 * @property {number} [checkMembersEvery=5000] The user data update interval (in ms).
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
exports.VoiceManagerOptions = {};

/**
 * Defaults options for the VoiceManager
 * @type {VoiceManagerOptions}
 */
exports.defaultVoiceManagerOptions = {
    userStorage: "./users.json",
    configStorage: "./configs.json",
    checkMembersEvery: 5000,
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
 * The config options
 * @typedef {object} ConfigOptions
 *
 * @property {Boolean} [trackBots=false] Whether bots are able to be tracked.
 * @property {Boolean} [trackAllChannels=true] Whether to track all of the guild's voice channels.
 * @property {Function} [exemptChannels] Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Snowflake[]} [channelIds=[]] The channels to track (if trackAllChannels is true this will be ignored).
 * @property {PermissionResolvable[]} [exemptPermissions=[]] Members with any of these permissions won't be tracked.
 * @property {Function} [exemptMembers] Function to filter members. If true is returned, the member won't be tracked.
 * @property {Boolean} [trackMute=true] Whether members who are muted should be tracked.
 * @property {Boolean} [trackDeaf=true] Whether members who are deafened should be tracked.
 * @property {number} [minUserCountToParticipate="0"] The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {number} [maxUserCountToParticipate="0"] The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {number} [minXpToParticipate="0"] The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [minLevelToParticipate="0"] The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [maxXpToParticipate="0"] The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {number} [maxLevelToParticipate="0"] The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {Function} [xpAmountToAdd] Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {Function} [voiceTimeToAdd] Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {boolean} [voiceTimeTrackingEnabled=true] Whether to enable the voice time tracking module.
 * @property {boolean} [levelingTrackingEnabled=true] Whether to enable the leveling tracking module.
 * @property {function} [levelMultiplier] Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
exports.ConfigOptions = {};

/**
 * Default options for config
 * @type {ConfigOptions}
 */
exports.defaultConfigOptions = {
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
 * Raw config object (used to store config's in the database).
 * @typedef {object} ConfigData
 *
 * @property {Snowflake} guildId The ID of the guild.
 * @property {Boolean} trackBots Whether bots are able to be tracked.
 * @property {Boolean} trackAllChannels Whether to track all of the guild's voice channels.
 * @property {Function} exemptChannels Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Snowflake[]} channelIds The channels to track (if trackAllChannels is true this will be ignored).
 * @property {PermissionResolvable[]} exemptPermissions Members with any of these permissions won't be tracked.
 * @property {Function} exemptMembers Function to filter members. If true is returned, the member won't be tracked.
 * @property {Boolean} trackMute Whether members who are muted should be tracked.
 * @property {Boolean} trackDeaf Whether members who are deafened should be tracked.
 * @property {number} minUserCountToParticipate The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {number} maxUserCountToParticipate The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {number} minXpToParticipate The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} minLevelToParticipate The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} maxXpToParticipate The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {number} maxLevelToParticipate The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {Function} xpAmountToAdd Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {Function} voiceTimeToAdd Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {boolean} voiceTimeTrackingEnabled Whether to enable the voice time tracking module.
 * @property {boolean} levelingTrackingEnabled Whether to enable the leveling tracking module.
 * @property {function} levelMultiplier Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
exports.ConfigData = {};

/**
 * The config edit method options
 * @typedef {object} ConfigEditOptions
 * @property {Boolean} [newTrackBots=false] Whether bots are able to be tracked.
 * @property {Boolean} [newTrackAllChannels=true] Whether to track all of the guild's voice channels.
 * @property {Function} [newExemptChannels] Function to filter channels. If true is returned, the channel won't be tracked.
 * @property {Snowflake[]} [newChannelIDs=[]] The channels to track (if trackAllChannels is true this will be ignored).
 * @property {PermissionResolvable[]} [newExemptPermissions=[]] Members with any of these permissions won't be tracked.
 * @property {Function} [newExemptMembers] Function to filter members. If true is returned, the member won't be tracked.
 * @property {Boolean} [newTrackMute=true] Whether members who are muted should be tracked.
 * @property {Boolean} [newTrackDeaf=true] Whether members who are deafened should be tracked.
 * @property {number} [newMinUserCountToParticipate="0"] The min amount of users to be in a channel to be tracked (0 is equal to no limit).
 * @property {number} [newMaxUserCountToParticipate="0"] The max amount of users to be in a channel to be tracked uptil (0 is equal to no limit).
 * @property {number} [newMinXpToParticipate="0"] The min amount of xp the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [newMinLevelToParticipate="0"] The min amount of level the user needs to have to be tracked (0 is equal to no limit).
 * @property {number} [newMaxXpToParticipate="0"] The max amount of xp the user can be tracked uptil (0 is equal to no limit).
 * @property {number} [newMaxLevelToParticipate="0"] The max amount of level the user can be tracked uptil (0 is equal to no limit).
 * @property {Function} [newXpAmountToAdd] Function for xpAmountToAdd. If not provided, the default value is used (Math.floor(Math.random() * 10) + 1).
 * @property {Function} [newVoiceTimeToAdd] Function for voiceTimeToAdd. If not provided, the default value is used (1000).
 * @property {boolean} [newVoiceTimeTrackingEnabled=true] Whether to enable the voice time tracking module.
 * @property {boolean} [newLevelingTrackingEnabled=true] Whether to enable the leveling tracking module.
 * @property {function} [newLevelMultiplier] Function for levelMultiplier. If not provided, the default value is used (0.1).
 */
exports.ConfigEditOptions = {};

/**
 * The user options
 * @typedef {object} UserOptions
 *
 * @property {UserVoiceTimeOptions} voiceTime The voice time data of the user.
 * @property {UserVoiceTimeChannelsOptions} voiceTime.channels The user's voice time in the channels.
 * @property {Number} voiceTime.total The user's total voice time.
 * @property {UserLevelingOptions} levelingData The leveling data of the user.
 * @property {Number} levelingData.xp The user's xp.
 * @property {Number} levelingData.level The user's level.
 */
exports.UserOptions = {};

/**
 * The user voice time options
 * @typedef {object} UserVoiceTimeOptions
 *
 * @property {UserVoiceTimeChannelsOptions} channels The user's voice time in the channels.
 * @property {Number} total The user's total voice time.
 */
exports.UserVoiceTimeOptions = {};

/**
 * The user voice time options
 * @typedef {object} UserLevelingOptions
 *
 * @property {Number} xp The user's xp.
 * @property {Number} level The user's level.
 */
exports.UserLevelingOptions = {};

/**
 * The user voice time options
 * @typedef {object} UserVoiceTimeChannelsOptions
 *
 * @property {Snowflake} channelId The id of the channel.
 * @property {Number} voiceTime The user's voice time in the channel.
 */
exports.UserVoiceTimeChannelsOptions = {};

/**
 * Default options for the user.
 * @type {UserOptions}
 */
exports.defaultUserOptions = {
    voiceTime: {
        channels: [],
        total: 0
    },
    levelingData: {
        xp: 0,
        level: 0
    }
};

/**
 * Raw user object (used to store user's in the database).
 * @typedef {object} UserData
 *
 * @property {Snowflake} userId The ID of the user.
 * @property {Snowflake} guildId The ID of the guild.
 * @property {UserVoiceTimeOptions} voiceTime The voice time data of the user.
 * @property {UserVoiceTimeChannelsOptions} voiceTime.channels The user's voice time in the channels.
 * @property {Number} voiceTime.total The user's total voice time.
 * @property {UserLevelingOptions} levelingData The leveling data of the user.
 * @property {Number} levelingData.xp The user's xp.
 * @property {Number} levelingData.level The user's level.
 */
exports.UserData = {};

/**
 * The user edit method options
 * @typedef {object} UserEditOptions
 *
 * @property {UserVoiceTimeOptions} [newVoiceTime] The new voice time options
 * @property {UserLevelingOptions} [newLevelingData] The new leveling options
 */
exports.UserEditOptions = {};

/**
 * The channelAndMember getter returned options
 * @typedef {object} channelAndMemberOptions
 *
 * @property {VoiceChannel} channel The user voice channel if present
 * @property {Member} member The guild member data of the user if present
 */
exports.channelAndMemberOptions = {};
