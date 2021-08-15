const { Client, Intents } = require("discord.js"), // npm install discord.js
    client = new Client({
        intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] // The GUILD_VOICE_STATES and GUILDS intents are required for discord-voice to function.
    }),
    client = new Discord.Client(),
    settings = {
        prefix: "v!",
        token: "Your Discord Bot Token"
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
    userId: String,
    guildId: String,
    data: {
        voiceTime: {
            channels: Array,
            total: Number
        },
        levelingData: {
            xp: Number,
            level: Number
        }
    }
});

// Create the model for user data
const userDataModel = mongoose.model("users", userDataSchema);

// Create the schema for config data
const configDataSchema = new mongoose.Schema({
    guildId: String,
    data: {
        trackBots: Boolean,
        trackAllChannels: Boolean,
        exemptChannels: String,
        channelIds: Array,
        exemptPermissions: [],
        exemptMembers: String,
        trackMute: Boolean,
        trackDeaf: Boolean,
        minUserCountToParticipate: Number,
        maxUserCountToParticipate: Number,
        minXpToParticipate: Number,
        minLevelToParticipate: Number,
        maxXpToParticipate: Number,
        maxLevelToParticipate: Number,
        xpAmountToAdd: String,
        voiceTimeToAdd: String,
        voiceTimeTrackingEnabled: Boolean,
        levelingTrackingEnabled: Boolean,
        levelMultiplier: String,
    }
});

// Create the model for config data
const configDataModel = mongoose.model("configs", configDataSchema);

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
    async saveUser(userId, guildId, userData) {
        // Add the new user to the database
        await userDataModel.create(userData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be saved in the database.
    async saveConfig(guildId, configData) {
        // Add the new config to the database
        await configDataModel.create(configData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be edited in the database.
    async editUser(userId, guildId, userData) {
        // Find by userId and guildId and update it
        await userDataModel.findOneAndUpdate({ userId: userId, guildId: guildId }, userData).exec();
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be edited in the database.
    async editConfig(guildId, configData) {
        // Find by guildId and update it
        await configDataModel.findOneAndUpdate({ guildId: guildId }, configData).exec();
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be deleted from the database.
    async deleteUser(userId, guildId) {
        // Find by userId and guildId and delete it
        await userDataModel.findOneAndDelete({ userId: userId, guildId: guildId }).exec();
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be deleted from the database.
    async deleteConfig(guildId) {
        // Find by userId and guildId and delete it
        await configDataModel.findOneAndDelete({ guildId: guildId }).exec();
        // Don't forget to return something!
        return true;
    }
};

// Create a new instance of your new class
const manager = new VoiceManagerWithOwnDatabase(client, {
    checkMembersEvery: 5000,
    default: {
        trackBots: false,
        trackAllChannels: true
    }
});
// We now have a voiceManager property to access the manager everywhere!
client.voiceManager = manager;

client.on("ready", () => {
    console.log("I'm ready!");
});

client.login(settings.token);
