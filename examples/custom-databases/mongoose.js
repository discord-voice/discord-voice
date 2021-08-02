const Discord = require("discord.js"),
  client = new Discord.Client(),
  settings = {
    prefix: "v!",
    token: "Your Discord Bot Token",
  };

// Connect to the database
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/voicetimes", { useFindAndModify: false });
const db = mongoose.connection;

// Check the connection
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB.");
});

// Create the schema for user data
const userDataSchema = new mongoose.Schema({
  userID: String,
  guildID: String,
  data: {
    voiceTime: {
      channels: [String],
      total: Number,
    },
    levelingData: {
      xp: Number,
      level: Number,
    },
  },
});

// Create the model for user data
const userDataModel = mongoose.model("users", userDataModel);

// Create the schema for config data
const configDataSchema = new mongoose.Schema({
  guildID: String,
  data: {
    trackBots: Boolean,
    trackAllChannels: Boolean,
    exemptChannels: String,
    channelIDs: [String],
    exemptPermissions: [],
    exemptMembers: String,
    trackMute: Boolean,
    trackDeaf: Boolean,
    minUserCountToParticipate: Number,
    maxUserCountToParticipate: Number,
    minXPToParticipate: Number,
    minLevelToParticipate: Number,
    maxXPToParticipate: Number,
    maxLevelToParticipate: Number,
    xpAmountToAdd: String,
    voiceTimeTrackingEnabled: Boolean,
    levelingTrackingEnabled: Boolean,
  },
});

// Create the model for config data
const configDataModel = mongoose.model("configs", configDataModel);

const { VoiceManager } = require("discord-voice");
const VoiceManagerWithOwnDatabase = class extends VoiceManager {
  // This function is called when the manager needs to get all users which are stored in the database.
  async getAllUsers() {
    // Get all users from the database. We fetch all documents by passing an empty condition.
    return await userDataModel.find({});
  }

  // This function is called when the manager needs to get all configs which are stored in the database.
  async getAllConfigs() {
    // Get all configs from the database. We fetch all documents by passing an empty condition.
    return await configDataModel.find({});
  }

  // This function is called when a user needs to be saved in the database.
  async saveUser(userID, guildID, userData) {
    // Add the new user to the database
    await userDataModel.create(userData);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a config needs to be saved in the database.
  async saveConfig(guildID, configData) {
    // Add the new config to the database
    await configDataModel.create(configData);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a user needs to be edited in the database.
  async editUser(userID, guildID, userData) {
    // Find by userID and guildID and update it
    await userDataModel
      .findOneAndUpdate({ userID: userID, guildID: guildID }, userData)
      .exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a config needs to be edited in the database.
  async editConfig(guildID, configData) {
    // Find by guildID and update it
    await configDataModel
      .findOneAndUpdate({ guildID: guildID }, configData)
      .exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a user needs to be deleted from the database.
  async deleteUser(userID, guildID) {
    // Find by userID and guildID and delete it
    await userDataModel
      .findOneAndDelete({ userID: userID, guildID: guildID })
      .exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a config needs to be deleted from the database.
  async deleteConfig(guildID) {
    // Find by userID and guildID and delete it
    await configDataModel.findOneAndDelete({ guildID: guildID }).exec();
    // Don't forget to return something!
    return true;
  }
};

// Create a new instance of your new class
const manager = new VoiceManagerWithOwnDatabase(client, {
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
