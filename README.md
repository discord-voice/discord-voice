<p align="center"><a href="https://nodei.co/npm/discord-voice/"><img src="https://nodei.co/npm/discord-voice.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discord-voice"> <img src="https://img.shields.io/github/repo-size/Lebyy/discord-voice"> <img src="https://img.shields.io/npm/l/discord-voice"> <img src="https://img.shields.io/npm/dt/discord-voice"> <img src="https://img.shields.io/github/contributors/Lebyy/discord-voice"> <img src="https://img.shields.io/github/package-json/dependency-version/Lebyy/discord-voice/mongoose"> <img src="https://img.shields.io/github/package-json/dependency-version/Lebyy/discord-voice/discord-logs"> <a href="https://discord.gg/pndumb6J3t"><img src="https://discordapp.com/api/guilds/815261972450115585/widget.png" alt="Discord server - https://discord.gg/pndumb6J3t"/></a> <a href="https://discord-voice.js.org"><img src="https://img.shields.io/badge/Documentation-Click%20here-blue" alt="Documentation - https://discord-voice.js.org"/></a></p>

# Discord-Voice
- A lightweight and easy to use voice activity tracker framework for discord bots, uses MongoDB.
- If you need help feel free to join our <a href="https://discord.gg/pndumb6J3t">discord server</a> to talk and help you with your code.
- If you encounter any of those fell free to open an issue in our <a href="https://github.com/Lebyy/discord-voice/issues">github repository</a>.
- TypeScript supported!

# Download & Update
You can download it from npm:
```cli
npm i discord-voice
```
You can update to a newer version to receive updates using npm.
```cli
npm update discord-voice
```

# Changelog
- **15 April 2021** (v1.0.4)
1. Fixed a bug with the mute handler
2. Updated the README to show how to use module

- **12 April 2021** (v1.0.3) - `WARNING! This update contains a lot of BREAKING changes in the way whole module works, considering reading the README again on how to initiate the new model.`
1. Added plenty of events which will be triggered on the user's vc actions. (Check the docs for a brief list of them)
2. Options are now guild based and adding them in the start function won't work anymore there are seperate function made for them. (Check the docs for a brief list of them)
3. Voice Time is now saved in objects! For each channel.
4. Improved alot of bugs and memory leaks with the whole module.

- **25 March 2021** (v1.0.2) - `WARNING! This update contains some breaking changes in the way start functions works.`
1. Added the system of blacklisting users.
2. Added the system of minimum users in a voice channel.
3. Added the resetGuild function.

# Examples
*Following example assumes that you are able to write asynchronous code (use `await`).*

- **Launch of the module**
```js
const Discord = require('discord.js'),
    client = new Discord.Client(),
    settings = {
        prefix: 'dv!',
        token: 'Your Discord Token'
    };

// We load the module here
const DiscordVoice = require("discord-voice");
// You need to supply your Discord.Client here with your mongodb URL!
const Voice = new DiscordVoice(client, "mongodb://...");

// We now have a discordVoice property to access Discord-Voice everywhere!
client.discordVoice = Voice;

client.on('ready', async () => {
    // We start the voice activity tracking here!
    await client.discordVoice.start();
});

client.login(settings.token);
```

- **Voice Time Command**

```js
const target = message.mentions.users.first() || message.author; // Grab the target.

const user = await client.discordVoice.fetch(target.id, message.guild.id); // Selects the target from the database.

if (!user) return message.channel.send("Seems like this user does not have any Voice Activity so far..."); // If there isnt such user in the database, we send a message in general.

message.channel.send(`> **${target.tag}** currently has ${user.data.voiceTime.total}ms of Total Voice Time!`); // We show the voice time. (OPTIONAL: You can also use the ms package here if you want it to be more concise.)
```

- **Leaderboard Command**

```js
const rawLeaderboard = await client.discordVoice.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most voice time in the current server.

if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

const leaderboard = await client.discordVoice.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.

const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nVoice Time: ${e.voiceTime.total}ms`); // We map the outputs.

message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
```

*Is time for you to get creative..*

# Methods
Shifted to our docs! Make sure to check them out [here](https://discord-voice.js.org)!

# Enjoying Discord-Voice?
Consider donating: https://www.buymeacoffee.com/lebyydev
Thanks 😊
