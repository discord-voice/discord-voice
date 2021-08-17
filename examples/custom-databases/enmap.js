const { Client, Intents } = require("discord.js"), // npm install discord.js
    client = new Client({
        intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] // The GUILD_VOICE_STATES and GUILDS intents are required for discord-voice to function.
    }),
    settings = {
        prefix: "v!",
        token: "Your Discord Bot Token"
    };

// Load Enmap
const Enmap = require("enmap");

// Create users table
const userDb = new Enmap({ name: "users" });

// Create configs table
const configDb = new Enmap({ name: "configs" });

const { VoiceManager } = require("discord-voice");
const VoiceManagerWithOwnDatabase = class extends VoiceManager {
    // This function is called when the manager needs to get all users which are stored in the database.
    async getAllUsers() {
        // Get all users from the database
        return userDb.fetchEverything().array();
    }

    // This function is called when the manager needs to get all configs which are stored in the database.
    async getAllConfigs() {
        // Get all configs from the database
        return configDb.fetchEverything().array();
    }

    // This function is called when a user needs to be saved in the database.
    async saveUser(userId, guildId, userData) {
        // Add the new user to the database
        userDb.set(`${userId}_${guildId}`, userData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be saved in the database.
    async saveConfig(guildId, configData) {
        // Add the new user to the database
        configDb.set(guildId, configData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be edited in the database.
    async editUser(userId, guildId, userData) {
        // Replace the unedited user with the edited user
        userDb.set(`${userId}_${guildId}`, userData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be edited in the database.
    async editConfig(guildId, configData) {
        // Replace the unedited config with the edited config
        configDb.set(guildId, configData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be deleted from the database.
    async deleteUser(userId, guildId) {
        // Remove the user from the database
        userDb.delete(`${userId}_${guildId}`);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be deleted from the database.
    async deleteConfig(guildId) {
        // Remove the config from the database
        configDb.delete(guildId);
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
