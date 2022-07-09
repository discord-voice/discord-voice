exports.DEFAULT_CHECK_INTERVAL = 5000;

exports.defaultVoiceManagerOptions = {
    storage: './guilds.json',
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

exports.defaultGuildOptions = {
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

exports.defaultUserOptions = {
    channels: [],
    totalVoiceTime: 0,
    xp: 0,
    level: 0
};

exports.defaultChannelOptions = {
    timeInChannel: 0
};
