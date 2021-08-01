const ms = require("ms"); // npm install ms
const Discord = require("discord.js"), // npm install discord.js
  client = new Discord.Client(),
  settings = {
    prefix: "v!",
    token: "Your Discord Bot Token",
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
    trackAllChannels: true,
  },
});
// We now have a voiceManager property to access the manager everywhere!
client.voiceManager = manager;

client.on("ready", () => {
  console.log("I'm ready!");
});

client.on("message", (message) => {
  const args = message.content
    .slice(settings.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "voicetime") {
    // This will send how much of total voiceTime the user has in the guild!

    let userData = client.voiceManager.users.find(
      (u) => u.guildID === message.guild.id && u.userID === message.author.id
    );
    if (!userData)
      return message.channel.send("You don't have any voice time recorded!");
    message.channel.send(
      `Your total voiceTime is ${ms(userData.data.data.voiceTime.total, {
        long: true,
      })}!`
    );
  }

  if (command === "leaderboard") {
    const users = client.voiceManager.users
      .filter((u) => u.guildID === message.guild.id)
      .slice(0, 20)
      .sort(
        (a, b) => b.data.data.voiceTime.total - a.data.data.voiceTime.total
      );
    // We grab top 10 users with most total voice time in the current server.

    if (users.length < 1)
      return message.channel.send("Nobody's in leaderboard yet.");
    const leaderboard = users.map(
      (user) =>
        `${
          users.findIndex(
            (i) => i.guildID === user.guildID && i.userID === user.userID
          ) + 1
        }. ${
          client.users.cache.get(user.userID)
            ? client.users.cache.get(user.userID).username
            : "Unknown"
        }#${
          client.users.cache.get(user.userID)
            ? client.users.cache.get(user.userID).discriminator
            : "0000"
        }\nVoice Time: ${ms(user.data.data.voiceTime.total, { long: true })}`
    );
    // Here we map the output.

    message.channel.send(`**Leaderboard**:\n\n${leaderboard.join("\n\n")}`);
    // This will send the leaderboard of the guild!
  }
});

client.login(settings.token);
