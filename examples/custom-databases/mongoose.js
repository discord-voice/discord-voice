const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildVoiceStates]
});

// Connect to the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');
const db = mongoose.connection;

// Check the connection
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB.');
});

// Create the schema for guilds
const guildSchema = new mongoose.Schema(
    {
        guildId: String,
        users: [
            {
                guildId: String,
                userId: String,
                channels: [
                    {
                        guildId: String,
                        channelId: String,
                        timeInChannel: Number
                    }
                ],
                totalVoiceTime: Number,
                xp: Number,
                level: Number
            }
        ],
        config: {
            trackBots: Boolean,
            trackAllChannels: Boolean,
            exemptChannels: String,
            channelIds: { type: [String], default: undefined },
            exemptPermissions: { type: [], default: undefined },
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
            levelMultiplier: String
        }
    },
    { id: false }
);

// Create the model
const guildModel = mongoose.model('guilds', guildSchema);

const { VoiceTimeManager } = require('discord-voice');
const VoiceTimeManagerWithOwnDatabase = class extends VoiceTimeManager {
    // This function is called when the manager needs to get all guilds which are stored in the database.
    async getAllGuilds() {
        // Get all guilds from the database. We fetch all documents by passing an empty condition.
        return await guildModel.find().lean().exec();
    }

    // This function is called when a guild needs to be saved in the database.
    async saveGuild(guildId, guildData) {
        // Add the new guild data to the database
        await guildModel.create(guildData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be edited in the database.
    async editGuild(guildId, guildData) {
        // Find by guildId and update it
        await guildModel.updateOne({ guildId }, guildData).exec();
        // Don't forget to return something!
        return true;
    }

    // This function is called when a guild needs to be deleted from the database.
    async deleteGuild(guildId) {
        // Find by guildId and delete it
        await guildModel.deleteOne({ guildId }).exec();
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
