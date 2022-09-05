const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildVoiceStates]
});

// Load nano
const nano = require('nano')('http://admin:mypassword@localhost:5984');
let guildDB;

// Check the DB
(async () => {
    if (!(await nano.db.list()).includes('guilds')) await nano.db.create('guilds');
    guildDB = nano.use('guilds');
    // Start the manager only after the DB got checked to prevent an error
    client.voiceTimeManager._init();
})();

const { VoiceTimeManager } = require('discord-voice');
const VoiceTimeManagerWithOwnDatabase = class extends VoiceTimeManager {
    // This function is called when the manager needs to get all guilds which are stored in the database.
    async getAllGuilds() {
        // Get all guilds from the database
        return (await guildDB.list({ include_docs: true })).rows.map((r) => r.doc);
    }

    // This function is called when a guild needs to be saved in the database.
    async saveGuild(guildId, guildData) {
        // Add the new guild data to the database
        await guildDB.insert(guildData, guildId);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be edited in the database.
    async editGuild(guildId, guildData) {
        // Get the unedited guild from the database
        const guild = await guildDB.get(guildId);
        // Edit the guild
        await guildDB.insert({ ...guild, ...guildData });
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be deleted from the database.
    async deleteGuild(guildId) {
        // Get the guild from the database
        const guild = await guildDB.get(guildId);
        // Remove the guild from the database
        await guildDB.destroy(guildId, guild._rev);
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
