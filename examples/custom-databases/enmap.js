const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildVoiceStates]
});

// Load Enmap
const Enmap = require('enmap');

// Create guilds table
const guildDB = new Enmap({ name: 'guilds' });

const { VoiceTimeManager } = require('discord-voice');
const VoiceTimeManagerWithOwnDatabase = class extends VoiceTimeManager {
    // This function is called when the manager needs to get all guilds which are stored in the database.
    async getAllGuilds() {
        // Get all guilds from the database
        return guildDB.fetchEverything().array();
    }

    // This function is called when a guild needs to be saved in the database.
    async saveGuild(guildId, guildData) {
        // Add the new guild to the database
        guildDB.set(guildId, guildData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be edited in the database.
    async editGuild(guildId, guildData) {
        // Replace the unedited guild with the edited guild
        guildDB.set(guildId, guildData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be deleted from the database.
    async deleteGuild(guildId) {
        // Remove the guild from the database
        guildDB.delete(guildId);
        // Don't forget to return something!
        return true;
    }
};

// Create a new instance of your new class
const manager = new VoiceTimeManagerWithOwnDatabase(client, {
    default: {
        trackBots: false,
        trackAllChannels: true
    }
});
// We now have a voiceTimeManager property to access the manager everywhere!
client.voiceTimeManager = manager;

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.login(process.env.DISCORD_BOT_TOKEN);
