const ms = require("ms"); // npm install ms
const { Client, Intents } = require("discord.js"), // npm install discord.js
    client = new Client({
        intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] // The GUILD_VOICE_STATES and GUILDS intents are required for discord-voice to function.
    }),
    settings = {
        prefix: "v!",
        token: "Your Discord Bot Token"
    };

// Requires Manager from discord-voice
const { VoiceManager } = require("discord-voice");
// Create a new instance of the manager class
const manager = new VoiceManager(client, {
    userStorage: "./users.json",
    configStorage: "./configs.json",
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

client.on("messageCreate", (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "voicetime") {
        // This will send how much of total voiceTime the user has in the guild!

        let userData = client.voiceManager.users.find((u) => u.guildId === message.guild.id && u.userId === message.author.id);
        if (!userData)
            return message.channel.send({
                content: "You don't have any voice time recorded!"
            });
        message.channel.send({
            content: `Your total voiceTime is ${ms(userData.data.data.voiceTime.total, {
                long: true
            })}!`
        });
    }

    if (command === "leaderboard") {
        const users = client.voiceManager.users
            .filter((u) => u.guildId === message.guild.id)
            .slice(0, 20)
            .sort((a, b) => b.data.data.voiceTime.total - a.data.data.voiceTime.total);
        // We grab top 10 users with most total voice time in the current server.

        if (users.length < 1)
            return message.channel.send({
                content: "Nobody's in leaderboard yet."
            });
        const leaderboard = users.map(
            (user) =>
                `${users.findIndex((i) => i.guildId === user.guildId && i.userId === user.userId) + 1}. ${client.users.cache.get(user.userId) ? client.users.cache.get(user.userId).username : "Unknown"}#${
                    client.users.cache.get(user.userId) ? client.users.cache.get(user.userId).discriminator : "0000"
                }\nVoice Time: ${ms(user.data.data.voiceTime.total, { long: true })}`
        );
        // Here we map the output.

        message.channel.send({
            content: `**Leaderboard**:\n\n${leaderboard.join("\n\n")}`
        });
        // This will send the leaderboard of the guild!
    }
});

client.login(settings.token);
