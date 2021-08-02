exports.defaultManagerOptions = {
  userStorage: "./users.json",
  configStorage: "./configs.json",
  checkMembersEvery: 5000,
  default: {
    trackBots: false,
    trackAllChannels: true,
    exemptChannels: () => false,
    channelIDs: [],
    exemptPermissions: [],
    exemptMembers: () => false,
    trackMute: true,
    trackDeaf: true,
    minUserCountToParticipate: 0,
    minXPToParticipate: 0,
    minLevelToParticipate: 0,
    maxXPToParticipate: 0,
    maxLevelToParticipate: 0,
    xpAmountToAdd: () => Math.floor(Math.random() * 10) + 1,
    voiceTimeTrackingEnabled: true,
    levelingTrackingEnabled: true,
  },
};

exports.defaultConfigData = {
  trackBots: false,
  trackAllChannels: true,
  exemptChannels: () => false,
  channelIDs: [],
  exemptPermissions: [],
  exemptMembers: () => false,
  trackMute: true,
  trackDeaf: true,
  minUserCountToParticipate: 0,
  maxUserCountToParticipate: 0,
  minXPToParticipate: 0,
  minLevelToParticipate: 0,
  maxXPToParticipate: 0,
  maxLevelToParticipate: 0,
  xpAmountToAdd: () => Math.floor(Math.random() * 10) + 1,
  voiceTimeTrackingEnabled: true,
  levelingTrackingEnabled: true,
};

exports.defaultUserData = {
  voiceTime: {
    channels: [],
    total: 0,
  },
  levelingData: {
    xp: 0,
    level: 0,
  },
};
