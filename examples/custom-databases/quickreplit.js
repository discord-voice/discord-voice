const { Client, Intents } = require("discord.js"), // npm install discord.js
    client = new Client({
        intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] // The GUILD_VOICE_STATES and GUILDS intents are required for discord-voice to function.
    }),
    settings = {
        prefix: "v!",
        token: "Your Discord Bot Token"
    };

// Load quick.replit
const { Database } = require("quick.replit");
const db = new Database();

const { VoiceManager } = require("discord-voice");
const VoiceManagerWithOwnDatabase = class extends VoiceManager {
    // This function is called when the manager needs to get all users which are stored in the database.
    async getAllUsers() {
        // Get all users from the database
        return await db.get("users");
    }

    // This function is called when the manager needs to get all configs which are stored in the database.
    async getAllConfigs() {
        // Get all configs from the database
        return await db.get("configs");
    }

    // This function is called when a user needs to be saved in the database.
    async saveUser(userId, guildId, userData) {
        // Add the new user to the database
        await db.push("users", userData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be saved in the database.
    async saveConfig(guildId, configData) {
        // Add the new user to the database
        await db.push("configs", configData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be edited in the database.
    async editUser(userId, guildId, userData) {
        // Get all users from the database
        const users = await db.get("users");
        // Find the user to edit
        const user = users.find((u) => u.guildId === guildId && u.userId === userId);
        // Remove the unedited user from the array
        const newUsersArray = users.filter((u) => u !== user);
        // Push the edited user into the array
        newUsersArray.push(userData);
        // Save the updated array
        await db.set("users", newUsersArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be edited in the database.
    async editConfig(guildId, configData) {
        // Get all configs from the database
        const configs = await db.get("configs");
        // Remove the unedited config from the array
        const newConfigsArray = configs.filter((config) => config.guildId !== guildId);
        // Push the edited config into the array
        newConfigsArray.push(configData);
        // Save the updated array
        await db.set("configs", newConfigsArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be deleted from the database.
    async deleteUser(userId, guildId) {
        // Get all users from the database
        const users = await db.get("users");
        // Find the user to edit
        const user = users.find((u) => u.guildId === guildId && u.userId === userId);
        // Remove the user from the array
        const newUsersArray = users.filter((u) => u !== user);
        // Save the updated array
        await db.set("users", newUsersArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be deleted from the database.
    async deleteConfig(guildId) {
        // Get all configs from the database
        const configs = await db.get("configs");
        // Remove the config from the array
        const newConfigsArray = configs.filter((config) => config.guildId !== guildId);
        // Save the updated array
        await db.set("configs", newConfigsArray);
        // Don't forget to return something!
        return true;
    }
};

// Create a new instance of your new class
const manager = new VoiceManagerWithOwnDatabase(
    client,
    {
        checkMembersEvery: 5000,
        default: {
            trackBots: false,
            trackAllChannels: true
        }
    },
    false
); // ATTENTION: Add "false" in order to not start the manager until the DB got checked, see below
// We now have a voiceManager property to access the manager everywhere!
client.voiceManager = manager;

// Check the DB when it is ready
db.on("ready", async () => {
    if (!Array.isArray(await db.get("users"))) await db.set("users", []);
    if (!Array.isArray(await db.get("configs"))) await db.set("configs", []);
    // Start the manager only after the DB got checked to prevent an error
    client.voiceManager._init();
});

client.on("ready", () => {
    console.log("I'm ready!");
});

client.login(settings.token);
