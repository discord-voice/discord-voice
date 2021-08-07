const { Client, Intents } = require("discord.js"), // npm install discord.js
  client = new Client({
    intents: [
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ], // The GUILD_VOICE_STATES and GUILDS intents are required for discord-voice to function.
  }),
  settings = {
    prefix: "v!",
    token: "Your Discord Bot Token",
  };

// Extends the GiveawaysManager class and update the refreshStorage method
const { VoiceManager } = require("discord-voice");
const VoiceManagerWithShardSupport = class extends VoiceManager {
  // The refreshStorage method is called when the database is updated on one of the shards
  async refreshStorage() {
    // This should make all shards refresh their cache with the updated database
    return client.shard.broadcastEval(
      () => this.voiceManager.getAllUsers() && this.voiceManager.getAllConfigs()
    );
  }
};

// Create a new instance of your new class
const manager = new VoiceManagerWithShardSupport(client, {
  userStorage: "./users.json",
  configStorage: "./configs.json",
  checkMembersEvery: 5000,
  default: {
    trackBots: false,
    trackAllChannels: true,
  },
});
// We now have a voiceManager property to access the manager everywhere!
client.voiceManager = manager;

client.on("ready", () => {
  console.log("I'm ready!");
});

client.login(settings.token);
