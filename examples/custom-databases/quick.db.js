const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildVoiceStates]
});

// Load quick.db
const { QuickDB } = require('quick.db');
const db = new QuickDB();

// Check the DB
(async () => {
    if (!Array.isArray(await db.get('guilds'))) await db.set('guilds', []);

    // Start the manager only after the DB got checked
    client.voiceTimeManager._init();
})();

const { VoiceTimeManager } = require('discord-voice');
const VoiceTimeManagerWithOwnDatabase = class extends VoiceTimeManager {
    // This function is called when the manager needs to get all guilds which are stored in the database.
    async getAllGuilds() {
        // Get all guilds from the database
        return await db.get('guilds');
    }

    // This function is called when a guild needs to be saved in the database.
    async saveGuild(guildId, guildData) {
        // Add the new guild data to the database
        await db.push('guilds', guildData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be edited in the database.
    async editGuild(guildId, guildData) {
        // Remove the guild data from the database
        await db.pull('guilds', (guild) => guild.guildId === guildId);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be deleted from the database.
    async deleteGuild(guildId) {
        // Remove the guild data from the database
        await db.pull('guilds', (guild) => guild.guildId === guildId);
        // Don't forget to return something!
        return true;
    }
};

// Create a new instance of your new class
const manager = new VoiceTimeManagerWithOwnDatabase(
    client,
    {
        default: {
            trackBots: false,
            trackAllChannels: true
        }
    },
    false
);
// We now have a voiceTimeManager property to access the manager everywhere!
client.voiceTimeManager = manager;

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.login(process.env.DISCORD_BOT_TOKEN);
