# <p align="center"><a href="https://discord-voice.js.org"><img src="https://discord-voice.js.org/icon-resized.png"></a></p><p align="center">Discord Voice</p>

# <p align="center"><a href="https://discord.gg/pndumb6J3t" target="_blank"> <img alt="Discord" src="https://img.shields.io/badge/Chat-Click%20here-7289d9?style=for-the-badge&logo=discord"> </a> <img src="https://img.shields.io/npm/dt/discord-voice?style=for-the-badge"> <img src="https://img.shields.io/npm/v/discord-voice?style=for-the-badge"> <a href="https://discord-voice.js.org"><img src="https://img.shields.io/badge/Documentation-Click%20here-blue?style=for-the-badge" alt="Documentation - https://discord-voice.js.org"/></a></p>

# What is Discord Voice?

> Discord Voice is a powerful [Node.js](https://nodejs.org/) module that allows you to easily track the user's voice time and levels!

# Features

-   **✨ Easy to use!**
-   **📁 Support for all databases! (default is json)**
-   **⚙️ Very customizable! (ignored channels, ignored members, ignored permissions, xp amount to add, voice time to add etc...)**
-   **🚀 Super powerful: createUser, createConfig, removeUser, removeConfig, updateUser and updateConfig!**
-   **🕸️ Support for shards!**
-   **and much more!**

# Installation

```bash
npm install --save discord-voice
```

# Examples

You can use this example bot on GitHub: [VoiceTimeTrackerBot](https://github.com/Lebyy/VoiceTimeTrackerBot)

# Usage of the modudle

```js
const { Client, Intents } = require("discord.js"),
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
```

After that, user's who are in the voice channel's that the bot has cached will be checked. You can pass an options object to customize the config. For a list of them refer to the [documentation](https://discord-voice.js.org/docs/main/master/typedef/VoiceManagerOptions).

# Create an user

```js
client.on("messageCreate", (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "create-user") {
        client.voiceManager.createUser(message.author.id, message.guild.id, {
            levelingData: {
                xp: 0,
                level: 0
            }
            // The user will have 0 xp and 0 level.
        });
    }
});
```

This allow's you create a user in the database if the user is not already present in the database. You can pass an options object to customize the user's data. For a list of them refer to the [documentation](https://discord-voice.js.org/docs/main/master/typedef/UserOptions).

# Create a config

```js
client.on("messageCreate", (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "create-config") {
        client.voiceManager.createConfig(message.guild.id, {
            trackBots: false, // If the user is a bot it will not be tracked.
            trackAllChannels: true, // All of the channels in the guild will be tracked.
            exemptChannels: () => false, // The user will not be tracked in these channels. (This is a function).
            channelIds: [], // The channel ids to track. (If trackAllChannels is true, this is ignored)
            exemptPermissions: [], // The user permissions to not track.
            exemptMembers: () => false, // The user will not be tracked. (This is a function).
            trackMute: true, // It will track users if they are muted aswell.
            trackDeaf: true, // It will track users if they are deafen aswell.
            minUserCountToParticipate: 0, // The min amount of users to be in a channel to be tracked.
            maxUserCountToParticipate: 0, // The max amount of users to be in a channel to be tracked.
            minXpToParticipate: 0, // The min amount of xp needed to be tracked.
            minLevelToParticipate: 0, // The min level needed to be tracked.
            maxXpToParticipate: 0, // The max amount of xp needed to be tracked.
            maxLevelToParticipate: 0, // The max level needed to be tracked.
            xpAmountToAdd: () => Math.floor(Math.random() * 10) + 1, // The amount of xp to add to the user (This is a function).
            voiceTimeToAdd: () => 1000, // The amount of time in ms to add to the user (This is a function).
            voiceTimeTrackingEnabled: true, // Whether the voiceTimeTracking module is enabled.
            levelingTrackingEnabled: true // Whether the levelingTracking module is enabled.
        });
    }
});
```

This allow's you create a config in the database if the config is not already present in the database. You can pass an options object to customize the config's data. For a list of them refer to the [documentation](https://discord-voice.js.org/docs/main/master/typedef/ConfigOptions).

# Remove an user

```js
client.on("messageCreate", (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "remove-user") {
        client.voiceManager.removeUser(message.author.id, message.guild.id); // Removes the user from the database and the cache.
    }
});
```

# Remove a config

```js
client.on("messageCreate", (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "remove-config") {
        client.voiceManager.removeConfig(message.guild.id); // Removes the config from the database and the cache.
    }
});
```

# Updating an user

```js
client.on("messageCreate", (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "edit-user") {
        client.voiceManager.updateUser(message.author.id, message.guild.id, {
            newVoiceTime: {
                channels: [],
                total: 0
            } // The new voice time user will have.
        });
    }
});
```

This allow's you edit a user's data. You need to pass an options object to edit the user's data. For a list of them refer to the [documentation](https://discord-voice.js.org/docs/main/master/typedef/UserEditOptions).

# Updating a config

```js
client.on("messageCreate", (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "edit-config") {
        client.voiceManager.updateConfig(message.guild.id, {
            newTrackBots: true // The module will now track bot user's voice time aswell.
        });
    }
});
```

This allow's you edit a config's data. You need to pass an options object to edit the config's data. For a list of them refer to the [documentation](https://discord-voice.js.org/docs/main/master/typedef/ConfigEditOptions).

# Fetch users

```js
// A list of all the users
const allUsers = client.voiceManager.users; // [ {User}, {User} ]

// A list of all the users on the server with ID "1909282092"
const onServer = client.voiceManager.users.filter((u) => u.guildId === "1909282092");

// The user on the server with Id "1909282092" and the user Id "1234567890"
const user = client.voiceManager.users.filter((u) => u.guildId === "1909282092" && u.userId === "1234567890");
```

# Fetch configs

```js
// A list of all the configs
const allConfigs = client.voiceManager.configs; // [ {Config}, {Config} ]

// The config of the guild with Id "1909282092"
const config = client.voiceManager.configs.filter((c) => c.guildId === "1909282092");
```

# Exempt Channels

```js
client.voiceManager.updateConfig(message.guild.id, {
    // The channel will not be tracked if it's name is "private"
    exemptChannels: (channel) => channel.name === "private")
});
```

⚠️ Note: If the function should be customizable

```js
const channelName = "private";
client.voiceManager.updateConfig(message.guild.id, {
    // The channel won't be tracked if it's name is equal to the value which is assigned to "channelName"
    exemptChannels: new Function("channel", `return channel.name === \'${channelName}\'`)
});
```

# Exempt Members

```js
client.voiceManager.updateConfig(message.guild.id, {
    // Only members who have the "Nitro Boost" role are able to be tracked
    exemptMembers: (member) => !member.roles.cache.some((r) => r.name === "Nitro Boost")
});
```

⚠️ Note: If the function should be customizable

```js
const roleName = "Nitro Boost";
client.voiceManager.updateConfig(message.guild.id, {
    // Only members who have the the role which is assigned to "roleName" are able to be tracked
    exemptMembers: new Function("member", `return !member.roles.cache.some((r) => r.name === \'${roleName}\')`)
});
```

# Voice Time To Add

```js
client.voiceManager.updateConfig(message.guild.id, {
    xpAmountToAdd: () => Math.floor(Math.random() * 10) + 1 // This will add a random amount between 1 and 10 of xp to the user.
});
```

⚠️ Note: The returned value should be a number or the default value (`Math.floor(Math.random() * 10) + 1`) will be used.

# Xp Amount To Add

```js
client.voiceManager.updateConfig(message.guild.id, {
    voiceTimeToAdd: () => 1000 // This will add 1000 ms of voice time everytime the user is checked.
});
```

⚠️ Note: The returned value should be a number or the default value (`1000`) will be used.

# Level Multiplier

```js
client.voiceManager.updateConfig(message.guild.id, {
    levelMultiplier: () => 0.1 // This will set the level multiplier to 0.1 (normally it's 0.1).
});
```

⚠️ Note: The returned value should be a number or the default value (`0.1`) will be used.

# Custom Database

You can use your custom database to save users and configs, instead of the json files (the "database" by default for `discord-voice`). For this, you will need to extend the `VoiceManager` class, and replace some methods with your custom ones. There are 8 methods you will need to replace:

-   `getAllUsers`: this method returns an array of stored users.
-   `getAllConfigs`: this method returns an array of stored configs.
-   `saveUser`: this method stores a new user in the database.
-   `saveConfig`: this method stores a new config in the database.
-   `editUser`: this method edits a user already stored in the database.
-   `editConfig`: this method edits a config already stored in the database.
-   `deleteUser`: this method deletes a user from the database (permanently).
-   `deleteConfig`: this method deletes a config from the database (permanently).

**⚠️ All the methods should be asynchronous to return a promise!**

Here is an example, using `quick.db`, a SQLite database. The comments in the code below are very important to understand how it works!

Other examples:

-   MongoDB
    -   [Mongoose](https://github.com/Lebyy/discord-voice/blob/master/examples/custom-databases/mongoose.js)
    -   [QuickMongo](https://github.com/Lebyy/discord-voice/blob/master/examples/custom-databases/quickmongo.js) ⚠️ Not recommended for high giveaway usage, use the `mongoose` example instead
-   [Enmap](https://github.com/Lebyy/discord-voice/blob/master/examples/custom-databases/enmap.js)
-   Replit Database ⚠️ Only usable if your bot is hosted on [Replit](https://replit.com/)
    -   [Quick.Replit](https://github.com/Lebyy/discord-voice/blob/master/examples/custom-databases/quickreplit.js)

```js
const { Client, Intents } = require("discord.js"), // npm install discord.js
    client = new Client({
        intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] // The GUILD_VOICE_STATES and GUILDS intents are required for discord-voice to function.
    }),
    settings = {
        prefix: "v!",
        token: "Your Discord Bot Token"
    };

// Load quick.db - it's an example of custom database, you can use MySQL, PostgreSQL, etc...
const db = require("quick.db");
if (!Array.isArray(db.get("users"))) db.set("users", []);
if (!Array.isArray(db.get("configs"))) db.set("configs", []);

const { VoiceManager } = require("discord-voice");
const VoiceManagerWithOwnDatabase = class extends VoiceManager {
    // This function is called when the manager needs to get all users which are stored in the database.
    async getAllUsers() {
        // Get all users from the database
        return db.get("users");
    }

    // This function is called when the manager needs to get all configs which are stored in the database.
    async getAllConfigs() {
        // Get all configs from the database
        return db.get("configs");
    }

    // This function is called when a user needs to be saved in the database.
    async saveUser(userId, guildId, userData) {
        // Add the new user to the database
        db.push("users", userData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be saved in the database.
    async saveConfig(guildId, configData) {
        // Add the new user to the database
        db.push("configs", configData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be edited in the database.
    async editUser(userId, guildId, userData) {
        // Get all users from the database
        const users = db.get("users");
        // Find the user to edit
        const user = users.find((u) => u.guildId === guildId && u.userId === userId);
        // Remove the unedited user from the array
        const newUsersArray = users.filter((u) => u !== user);
        // Push the edited user into the array
        newUsersArray.push(userData);
        // Save the updated array
        db.set("users", newUsersArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be edited in the database.
    async editConfig(guildId, configData) {
        // Get all configs from the database
        const configs = db.get("configs");
        // Remove the unedited config from the array
        const newConfigsArray = configs.filter((config) => config.guildId !== guildId);
        // Push the edited config into the array
        newConfigsArray.push(configData);
        // Save the updated array
        db.set("configs", newConfigsArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a user needs to be deleted from the database.
    async deleteUser(userId, guildId) {
        // Get all users from the database
        const users = db.get("users");
        // Find the user to edit
        const user = users.find((u) => u.guildId === guildId && u.userId === userId);
        // Remove the user from the array
        const newUsersArray = users.filter((u) => u !== user);
        // Save the updated array
        db.set("users", newUsersArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a config needs to be deleted from the database.
    async deleteConfig(guildId) {
        // Get all configs from the database
        const configs = db.get("configs");
        // Remove the config from the array
        const newConfigsArray = configs.filter((config) => config.guildId !== guildId);
        // Save the updated array
        db.set("configs", newConfigsArray);
        // Don't forget to return something!
        return true;
    }
};

// Create a new instance of your new class
const manager = new VoiceManagerWithOwnDatabase(client, {
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

client.login(settings.token);
```

# Shards Support

To make `discord-voice` work with shards, you will need to extend the `VoiceManager` class and update the `refreshStorage()` method. This method should call the `getAllUsers()` and `getAllConfigs()` method for every shard, so all `VoiceManager`'s synchronize their cache with the updated database.

```js
const { Client, Intents } = require("discord.js"), // npm install discord.js
    client = new Client({
        intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] // The GUILD_VOICE_STATES and GUILDS intents are required for discord-voice to function.
    }),
    settings = {
        prefix: "v!",
        token: "Your Discord Bot Token"
    };

// Extends the VoiceManager class and update the refreshStorage method
const { VoiceManager } = require("discord-voice");
const VoiceManagerWithShardSupport = class extends VoiceManager {
    // The refreshStorage method is called when the database is updated on one of the shards
    async refreshStorage() {
        // This should make all shards refresh their cache with the updated database
        return client.shard.broadcastEval(() => this.voiceManager.getAllUsers() && this.voiceManager.getAllConfigs());
    }
};

// Create a new instance of your new class
const manager = new VoiceManagerWithShardSupport(client, {
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

client.login(settings.token);
```

<div>Icons made by <a href="https://www.flaticon.com/authors/surang" title="surang">surang</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
