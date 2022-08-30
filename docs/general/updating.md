# Updating from v2 to v3

## Before you start
v3 requires Node 16.9 or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

## Breaking Changes
### Data Storage Structure
discord-voice v3 now uses the powerful discord.js collection system to store data. This means that data is stored in a much more efficient way than before.

⚠️ **This is a breaking change.** If you're using the old data structure, you will need to import data from the old data structure into the new data structure. Refer to the [import example](https://github.com/discord-voice/discord-voice/blob/master/examples/import_data_from_v2.js).

### Discord.js Version
discord.js v14.x is the latest version of discord.js that is compatible with discord-voice v3.

### New way to fetch users and configs
discord-voice v3 now stores the users and configs inside only 1 guild object in the database. This means that you can no longer fetch users and configs individually.

```diff
// A list of all the users
- const allUsers = client.voiceManager.users; // [ {User}, {User} ]
+ const allGuilds = client.voiceTimeManager.guilds; 
+ const allUsers = allGuilds.map(guild => guild.users); // [ [ {User}, {User} ], [ {User}, {User} ] ]

// A list of all the users on the server with ID "1909282092"
- const onServer = client.voiceManager.users.filter((u) => u.guildId === "1909282092"); // [ {User}, {User} ]
+ const guild = client.voiceTimeManager.guilds.get('1909282092'); // {Guild}
+ const onServer = guild.users; // [ {User}, {User} ]

// The user on the server with Id "1909282092" and the user Id "1234567890"
- const user = client.voiceManager.users.filter((u) => u.guildId === "1909282092" && u.userId === "1234567890");
+ const server = client.voiceTimeManager.guilds.get('1909282092'); // {Guild}
+ const user = server.users.get('1234567890'); // {User}

// A list of all the configs
- const allConfigs = client.voiceManager.configs; // [ {Config}, {Config} ]
+ const allGuilds = client.voiceTimeManager.guilds;
+ const allConfigs = allGuilds.map(guild => guild.config); // [ {Config}, {Config} ]

// The config of the guild with Id "1909282092"
- const config = client.voiceManager.configs.filter((c) => c.guildId === "1909282092");
+ const guild = client.voiceTimeManager.guilds.get('1909282092'); // {Guild}
+ const config = guild.config; // {Config}
```

### New way to create users and configs
discord-voice v3 now dosen't offer individual user and config creation. Instead, you can create a new user and config for a guild at once.

```diff
- client.voiceManager.createUser(interaction.user.id, interaction.guild.id, {
-            levelingData: {
-                xp: 0,
-                level: 0
-            }
-            // The user will have 0 xp and 0 level.
- });

+  client.voiceTimeManager.create(interaction.guild.id, {
+    users: [
+        {   
+            guildId: '1234567890',
+            userId: interaction.guild.id,
+            xp: 0,
+           level: 0
+        }
+        // The user will have 0 xp and 0 level.
+    ],
+    config: {
+      trackBots: false, // If the user is a bot it will not be tracked.
+      trackAllChannels: true, // All of the channels in the guild will be tracked.
+    }
+ });
```

### New way to update users and configs
discord-voice v3 now dosen't offer individual user and config updating. Instead, you can update a user and config for a guild at once.

```diff
- client.voiceManager.updateUser(interaction.user.id, interaction.guild.id, {
-    newVoiceTime: 1000
- });
-
- client.voiceManager.updateConfig(interaction.guild.id, {
-    newTrackBots: true
- });

+ const guild = client.voiceTimeManager.guilds.get(interaction.guild.id);
+ const user = guild.users.get(interaction.user.id);
+ user.edit({
+    voiceTime: 1000
+ });
+
+ guild.config.edit({
+    trackBots: true
+ });
```

### New way to delete users
discord-voice v3 now dosen't offer individual user deletion. Instead, you can delete a user by using the delete function offered by the user class.

```diff
- client.voiceManager.deleteUser(interaction.user.id, interaction.guild.id);

+ const guild = client.voiceTimeManager.guilds.get(interaction.guild.id);
+ const user = guild.users.get(interaction.user.id);
+ user.delete();
```

### Edit options have been renamed
discord-voice v3 has renamed the edit options for users and configs.
Refer to the new options for [users](https://discord-voice.js.org/docs/main/master/typedef/UserEditOptions) and [configs](https://discord-voice.js.org/docs/main/master/typedef/ConfigEditOptions).

```diff
- client.voiceManager.updateUser(interaction.user.id, interaction.guild.id, {
-    newVoiceTime: 1000
- });
- client.voiceManager.updateConfig(interaction.guild.id, {
-    newTrackBots: true
- });

+ const guild = client.voiceTimeManager.guilds.get(interaction.guild.id);
+ const user = guild.users.get(interaction.user.id);
+ user.edit({
+    totalVoiceTime	: 1000
+ });
+ guild.config.edit({
+    trackBots: true
+ });
```

### The user data structure has changed
discord-voice v3 has changed the user data structure.
Refer to the new [user data structure](https://discord-voice.js.org/docs/main/master/typedef/UserData).

```diff
- // Old user data object.
- {
-    userId: "1234567890",
-    guildId: "1909282092",
-    voiceTime: {
-        total: 1000,
-        channels: [
-            {
-                channelId: "1234567890",
-                time: 1000
-            }
-        ]
-    },
-    levelingData: {
-        xp: 0,
-        level: 0
-    }
- }

+ // New user data object.
+ { 
+   userId: "1234567890",
+   guildId: "1909282092",
+   totalVoiceTime: 1000,
+   channels: {
+       guildId: "1909282092",
+       channelId: "1234567890",
+       time: 1000
+   },
+   xp: 0,
+   level: 0
+ }
```

### Guilds, Users, Configs and Channels are now classes
discord-voice v3 now offers classes for guilds, users, configs and channels. This means that you can now use methods on them.

### New extraData property in the guild class
discord-voice v3 now offers an extraData property in the guild class. This property can be used to store extra data for the guild.

### Example bot updated to support slash commands
Last but not least, the example bot has been updated to support slash commands.