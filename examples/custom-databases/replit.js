const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildVoiceStates]
});

// Load Replit Database
const Database = require('@replit/database');
const db = new Database();
(async () => {
    if (!Array.isArray(await db.get('guilds'))) await db.set('guilds', []);
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
        // Get all guilds from the database
        const guildsArray = await db.get('guilds');
        // Push the new guild into the array
        guildsArray.push(guildData);
        // Save the updated array
        await db.set('guilds', guildsArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be edited in the database.
    async editGuild(guildId, guildData) {
        // Get all guilds from the database
        const guilds = await db.get('guilds');
        // Remove the unedited guild from the array
        const newGuildsArray = guilds.filter((guild) => guild.guildId !== guildId);
        // Push the edited guild into the array
        newGuildsArray.push(guildData);
        // Save the updated array
        await db.set('guilds', newGuildsArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be deleted from the database.
    async deleteGuild(guildId) {
        // Get all guilds from the database
        const guilds = await db.get('guilds');
        // Remove the guild from the array
        const newGuildsArray = guilds.filter((guild) => guild.guildId !== guildId);
        // Save the updated array
        await db.set('guilds', newGuildsArray);
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
