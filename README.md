# <p align="center"><a href="https://discord-voice.js.org"><img src="https://discord-voice.js.org/icon-resized.png"></a></p><p align="center">Discord Voice</p>

# <p align="center"><a href="https://discord.gg/pndumb6J3t" target="_blank"> <img alt="Discord" src="https://img.shields.io/badge/Chat-Click%20here-7289d9?style=for-the-badge&logo=discord"> </a> <img src="https://img.shields.io/npm/dt/discord-voice?style=for-the-badge"> <img src="https://img.shields.io/npm/v/discord-voice?style=for-the-badge"> <a href="https://discord-voice.js.org"><img src="https://img.shields.io/badge/Documentation-Click%20here-blue?style=for-the-badge" alt="Documentation - https://discord-voice.js.org"/></a></p>

# What is Discord Voice?

> Discord Voice is a powerful [Node.js](https://nodejs.org/) module that allows you to easily track the user's voice time and levels!

# Features

-   **✨ Easy to use!**
-   **📁 Support for all databases! (default is json)**
-   **⚙️ Very customizable! (ignored channels, ignored members, ignored permissions, xp amount to add, voice time to add etc...)**
-   **🚀 Super powerful: create, edit and delete!**
-   **🕸️ Support for shards!**
-   **🔐 Discord.js Collection Based!**
-   **and much more!**

# Installation

```bash
npm install --save discord-voice
```

# Examples

You can use this example bot on GitHub: [VoiceTimeTrackerBot](https://github.com/discord-voice/VoiceTimeTrackerBot)

# Launch of the module
Required Discord Intents: `Guilds` and `GuildVoiceStates`.  

```js
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildVoiceStates
    ]
});

// Requires Manager from discord-voice
const { VoiceTimeManager } = require('discord-voice');
const manager = new VoiceTimeManager(client, {
    storage: './guilds.json',
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
```

After that, user's who are in the voice channel's that the bot has cached will be checked. 
You can pass an options object to customize the giveaways. Here is a list of them:

-   **client**: the discord client (your discord bot instance).
-   **[and many other optional parameters to customize the manager - read documentation](https://discord-voice.js.org/docs/main/master/typedef/VoiceManagerOptions)**

#

# Create a guild

```js
client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'create-guild') {
        const guildId = interaction.options.getString('guildId');
        const users = interaction.options.getString('users');
        const options = interaction.options.getString('options');

        client.voiceTimeManager.create(guildId, users, options).then(() => {
                interaction.reply('Success! Guild Created!');
        }).catch((err) => {
                interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
        });
    };
});
```

- This allow's you create a guild in the database if the guild is not already present in the database. 
You can pass an options object to customize the guild's data. For a list of them refer to the [documentation](https://discord-voice.js.org/docs/main/master/typedef/GuildOptions).

# Editing a guild

```js
client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'edit') {
        const guildId = interaction.options.getString('guildId');

        client.voiceTimeManager.edit(guildId, {
            trackBots: true,
            trackAllChannels: false
        }).then(() => {
                interaction.reply('Success! Guild updated!');
        }).catch((err) => {
                interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
        });
    }
});
```

- This allow's you edit a guild's data. 
You need to pass an options object to edit the guild's data. For a list of them refer to the [documentation](https://discord-voice.js.org/docs/main/master/typedef/GuildEditOptions).

# Delete a guild

```js
client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'delete') {
        const guildId = interaction.options.getString('guildId');

        client.voiceTimeManager.delete(guildId).then(() => {
                interaction.reply('Success! Guild deleted!');
        }).catch((err) => {
                interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
        });
    }
});
```

- This allow's you delete a guild from the database if the guild is present in the database.


# Fetch guilds

```js
// A list of all the guilds in the database.
const allGuilds = client.voiceTimeManager.guilds; // Returns a Discord Collection of Guilds (Discord.Collection<guildId, guildData>)

// Returns the guild with Id "1909282092"
const guild = client.voiceTimeManager.guilds.get('1909282092'); // Returns a Guild. (Discord.Collection<guildId, guildData>)

// A list of all guilds with atleast 1 user in the database.
const guildWithUsers = client.voiceTimeManager.guilds.filter((guild) => guild.users.size > 0); // Returns a Discord Collection of Guilds (Discord.Collection<guildId, guildData>)
```

# Exempt Channels

```js
const guildId = '1909282092';
const guild = client.voiceTimeManager.guilds.get(guildId);
guild.config.edit({
    // The channel will not be tracked if it's name is "private"
    exemptChannels: (channel) => channel.name === "private")
});
```

⚠️ **Note (only for proficients) (this applies to all config's which expect a function input)**: if you want to use values of global variables inside of the function without using `guild.extraData`, you can use the [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) constructor:

```js
const guildId = '1909282092';
const guild = client.voiceTimeManager.guilds.get(guildId);
const channelName = "private";
guild.config.edit({
    // The channel won't be tracked if it's name is equal to the value which is assigned to "channelName"
    exemptChannels: new Function(
        "channel", 
        "guild",
        `return channel.name === \'${channelName}\'`)
});
```

<u>**⚠ Note**</u>

-   You can use `this`, instead of the `guild` parameter, inside of the function string to access anything of the giveaway instance.  
    For example: `this.extraData`, or `this.client`.
-   Strings have to be "stringified" (wrapped in quotation marks) again like you can see in the example.  
    Array brackets also have to be stated again.
-   Global variables which contain numbers with more than 16 digits cannot be used.  
    => Snoflakes have to be "stringified" correctly to avoid misbehaviour.
-   If you want to make an asynchronous function in this format, refer to [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) article.
-   <u>**Because of those various complications it is therefore highly suggested to use `guild.extraData` for storing variables.**</u>  
    But if you really want to do it in this way and need more information/help, please visit the [Discord Server](https://discord.gg/pndumb6J3t).

# Exempt Members

```js
const guildId = '1909282092';
const guild = client.voiceTimeManager.guilds.get(guildId);
guild.config.edit({
    // Only members who have the "Nitro Boost" role are able to be tracked
    exemptMembers: (member) => !member.roles.cache.some((r) => r.name === "Nitro Boost")
});
```

⚠️ **Note (only for proficients) (this applies to all config's which expect a function input)**: if you want to use values of global variables inside of the function without using `guild.extraData`, you can use the [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) constructor:

```js
const guildId = '1909282092';
const guild = client.voiceTimeManager.guilds.get(guildId);
const roleName = "Nitro Boost";
guild.config.edit({
    // Only members who have the the role which is assigned to "roleName" are able to be tracked
    exemptMembers: new Function(
        "member", 
        "guild",
        `return !member.roles.cache.some((r) => r.name === \'${roleName}\')`)
});
```

<u>**⚠ Note**</u>

-   You can use `this`, instead of the `guild` parameter, inside of the function string to access anything of the giveaway instance.  
    For example: `this.extraData`, or `this.client`.
-   Strings have to be "stringified" (wrapped in quotation marks) again like you can see in the example.  
    Array brackets also have to be stated again.
-   Global variables which contain numbers with more than 16 digits cannot be used.  
    => Snoflakes have to be "stringified" correctly to avoid misbehaviour.
-   If you want to make an asynchronous function in this format, refer to [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) article.
-   <u>**Because of those various complications it is therefore highly suggested to use `guild.extraData` for storing variables.**</u>  
    But if you really want to do it in this way and need more information/help, please visit the [Discord Server](https://discord.gg/pndumb6J3t).

# Voice Time To Add

```js
const guildId = '1909282092';
const guild = client.voiceTimeManager.guilds.get(guildId);
guild.config.edit({
    xpAmountToAdd: (guild) => Math.floor(Math.random() * 10) + 1 // This will add a random amount between 1 and 10 of xp to the user.
});
```

⚠️ Note: The returned value should be a number or the default value (`Math.floor(Math.random() * 10) + 1`) will be used.

# Xp Amount To Add

```js
const guildId = '1909282092';
const guild = client.voiceTimeManager.guilds.get(guildId);
guild.config.edit({
    voiceTimeToAdd: () => 1000 // This will add 1000 ms of voice time everytime the user is checked.
});
```

⚠️ Note: The returned value should be a number or the default value (`1000`) will be used.

# Level Multiplier

```js
const guildId = '1909282092';
const guild = client.voiceTimeManager.guilds.get(guildId);
guild.config.edit({
    levelMultiplier: () => 0.1 // This will set the level multiplier to 0.1 (normally it's 0.1).
});
```

⚠️ Note: The returned value should be a number or the default value (`0.1`) will be used.

# Custom Database

You can use your custom database to save guilds, instead of the json files (the "database" by default for `discord-voice`). For this, you will need to extend the `VoiceTimeManager` class, and replace some methods with your custom ones. There are 4 methods you will need to replace:

-   `getAllGuilds`: this method returns an array of stored guilds.
-   `saveGuild`: this method stores a new guild in the database.
-   `editGuild`: this method edits a guild already stored in the database.
-   `deleteGuild`: this method deletes a guild from the database (permanently).

**⚠️ All the methods should be asynchronous to return a promise!**

<u>**SQL examples**</u>

-   [MySQL](https://github.com/discord-voice/discord-voice/blob/master/examples/custom-databases/mysql.js)
-   SQLite
    -   [Quick.db](https://github.com/discord-voice/discord-voice/blob/master/examples/custom-databases/quick.db.js)
    -   [Enmap](https://github.com/discord-voice/discord-voice/blob/master/examples/custom-databases/enmap.js)

<u>**NoSQL examples**</u>

-   MongoDB
    -   [Mongoose](https://github.com/discord-voice/discord-voice/blob/master/examples/custom-databases/mongoose.js)
    -   [QuickMongo](https://github.com/discord-voice/discord-voice/blob/master/examples/custom-databases/quickmongo.js) ⚠️ Not recommended for high giveaway usage, use the `mongoose` example instead
-   [Apache CouchDB - Nano](https://github.com/discord-voice/discord-voice/blob/master/examples/custom-databases/nano.js)
-   Replit Database ⚠️ Only usable if your bot is hosted on [Replit](https://replit.com/)
    -   [@replit/database](https://github.com/discord-voice/discord-voice/blob/master/examples/custom-databases/replit.js)
    -   [Quick.Replit](https://github.com/discord-voice/discord-voice/blob/master/examples/custom-databases/quick.replit.js)

<div>Icons made by <a href="https://www.flaticon.com/authors/surang" title="surang">surang</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
