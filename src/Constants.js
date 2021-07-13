exports.defaultManagerOptions = {
  userStorage: "./users.json",
  configStorage: "./configs.json",
  checkMembersEvery: 5000,
  default: {
    trackBots: false,
    trackAllChannels: true,
    exemptChannels: () => false,
    userLimit: 0,
    channelIDs: [],
    exemptPermissions: [],
    exemptMembers: () => false,
    trackMute: true,
    trackDeaf: true,
    isEnabled: true,
  },
};

exports.defaultConfig = {
  trackBots: false,
  trackAllChannels: true,
  exemptChannels: () => false,
  userLimit: 0,
  channelIDs: [],
  exemptPermissions: [],
  exemptMembers: () => false,
  trackMute: true,
  trackDeaf: true,
  isEnabled: true,
};
