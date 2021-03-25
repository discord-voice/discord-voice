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
- **25 March 2021** (v1.0.2) - `WARNING! This update contains some breaking changes in the way start functions works.`
1. Added the system of blacklisting users.
2. Added the system of minimum users in a voice channel.
3. Added the resetGuild function.

# Setting Up
First things first, we include the module into the project.
```js
const Voice = require("discord-voice");
```
After that, you need to provide a valid mongo database url, and set it. You can do so by:
```js
Voice.setURL("mongodb://..."); // You only need to do this ONCE per process.
```

# Examples
*Examples assume that you have setted up the module as presented in 'Setting Up' section.*
*Following examples assume that your `Discord.Client` is called `client`.*

*Following examples assume that your `client.on("message", message` is called `message`.*

*Following example contains isolated code which you need to integrate in your own command handler.*

*Following example assumes that you are able to write asynchronous code (use `await`).*

- **Starting The Voice Activity Tracking**

```js
client.on('ready', async () => {
const StartVoice = await Voice.start(client, false, true);
});
```
- **Voice Time Command**

```js
const target = message.mentions.users.first() || message.author; // Grab the target.

const user = await Voice.fetch(target.id, message.guild.id); // Selects the target from the database.

if (!user) return message.channel.send("Seems like this user does not have any Voice Activity so far..."); // If there isnt such user in the database, we send a message in general.

message.channel.send(`> **${target.tag}** currently has ${user.data.voiceTime}ms of Voice Time!`); // We show the voice time. (OPTIONAL: You can also use the ms package here if you want it to be more concise.)
```

- **Leaderboard Command**

```js
const rawLeaderboard = await Voice.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most message(s) in the current server.

if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

const leaderboard = await Voice.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.

const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nVoice Time: ${e.voiceTime}ms`); // We map the outputs.

message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
```

*Is time for you to get creative..*

# Methods
**createUser**

Creates an entry in database for that user if it doesnt exist.
```js
Voice.createUser(<UserID - String>, <GuildID - String>);
```
- Output:
```
Promise<Object>
```
**deleteUser**

If the entry exists, it deletes it from database.
```js
Voice.deleteUser(<UserID - String>, <GuildID - String>);
```
- Output:
```
Promise<Object>
```
**start**

It starts tracking the voice activity of the user's in the configured channel or all voice channels, you can also supply the min limit of users required in channel for it to start counting (0 = unlimited), in that guild. It creates a new user, if there is no entry for that user. 
```js
Voice.start(<Client - Discord.js Client>, <trackbots - boolean, disabled by default>, <trackallchannels - boolean, enabled by default>, <userlimit - number, 0 by default>, <channelID - String>);
```
- Output:
```
Promise<Boolean>
```
**setVoiceTime**

It sets the Voice Time to a specified amount.
```js
Voice.setVoiceTime(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**fetch**

Retrives selected entry from the database, if it exists.
```js
Voice.fetch(<UserID - String>, <GuildID - String>, <FetchPosition - Boolean>);
```
- Output:
```
Promise<Object>
```
**addVoiceTime**

It adds a specified amount of voice time in ms to the current amount of voice time for that user, in that guild.
```js
Voice.addVoiceTime(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**subtractVoiceTime**

It removes a specified amount of voice time in ms to the current amount of voice time for that user, in that guild.
```js
Voice.subtractVoiceTime(<UserID - String>, <GuildID - String>, <Amount - Integer>);
```
- Output:
```
Promise<Boolean/Object>
```
**resetGuild**

It deletes the entire guild's data.
```js
Voice.resetGuild(<GuildID - String>);
```
- Output:
```
Promise<Boolean/Object>
```
**fetchLeaderboard**

It gets a specified amount of entries from the database, ordered from higgest to lowest within the specified limit of entries.
```js
Voice.fetchLeaderboard(<GuildID - String>, <Limit - Integer>);
```
- Output:
```
Promise<Array [Objects]>
```
**computeLeaderboard**

It returns a new array of object that include voice time, guild id, user id, leaderboard position, username and discriminator.
```js
Voice.computeLeaderboard(<Client - Discord.js Client>, <Leaderboard - fetchLeaderboard output>, <fetchUsers - boolean, disabled by default>);
```
- Output:
```
Promise<Array [Objects]>
```
**blacklist**

It will blacklist the user which will make it not count their voice time.
```js
Voice.blacklist(<UserID - String>, <GuildID - String>);
```
- Output:
```
Promise<Boolean/Object>
```
**unblacklist**

It will un-blacklist the user which will make it count their voice time.
```js
Voice.blacklist(<UserID - String>, <GuildID - String>);
```
- Output:
```
Promise<Boolean/Object>
```

# Enjoying Discord-Voice?
Consider donating: https://www.buymeacoffee.com/lebyydev
Thanks 😊
