const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildVoiceStates]
});

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

const { readFile, access } = require('fs/promises');

/*
 * Note: This example uses the default database, which is a JSON file.
 * If you are using a custom database, you will have to provide the importData function the required users and configs array from your database.
*/

client.on('ready', async () => {
    // Getting the users and configs from the old database
    let users = [];
    let configs = [];

    const usersStorageExists = await access('./users.json') // Change this to the path of your users.json file
        .then(() => true)
        .catch(() => false);
    if (!usersStorageExists) return console.log('No users storage found.');
    const usersStorageContent = await readFile('./users.json', { encoding: 'utf-8' }); // Change this to the path of your users.json file
    if (!usersStorageContent.trim().startsWith('[') || !usersStorageContent.trim().endsWith(']')) {
        console.log(usersStorageContent);
        throw new SyntaxError('The users storage file is not properly formatted (does not contain an array).');
    }
    try {
        users =  await JSON.parse(usersStorageContent, (_, v) =>
            typeof v === 'string' && /BigInt\("(-?\d+)"\)/.test(v) ? eval(v) : v
        );
    } catch (err) {
        if (err.message.startsWith('Unexpected token')) {
            throw new SyntaxError(
                `${err.message} | LINK: (${require('path').resolve(this.options.storage)}:1:${err.message
                    .split(' ')
                    .at(-1)})`
            );
        }
        throw err;
    }

    const configsStorageExists = await access('./configs.json') // Change this to the path of your configs.json file
        .then(() => true)
        .catch(() => false);
    if (!configsStorageExists) return console.log('No configs storage found.');
    const configsStorageContent = await readFile(this.options.storage, { encoding: 'utf-8' });
    if (!configsStorageContent.trim().startsWith('[') || !configsStorageContent.trim().endsWith(']')) {
        console.log(configsStorageContent);
        throw new SyntaxError('The storage file is not properly formatted (does not contain an array).');
    }

    try {
        configs = await JSON.parse(configsStorageContent, (_, v) =>
            typeof v === 'string' && /BigInt\("(-?\d+)"\)/.test(v) ? eval(v) : v
        );
    } catch (err) {
        if (err.message.startsWith('Unexpected token')) {
            throw new SyntaxError(
                `${err.message} | LINK: (${require('path').resolve(this.options.storage)}:1:${err.message
                    .split(' ')
                    .at(-1)})`
            );
        }
        throw err;
    }
    
    /*
        * Note: Remove this line after you have imported the data once.
        * This line will import the data from the old database to the new database.
        * If you run this line multiple times, it will import the data multiple times.
        * This will cause the data to be duplicated.
        * If you want to import the data again, you will have to delete the new database first.
    */
    await importData(users, configs);
    
    console.log('Bot is ready!');
});

/*
 * You can remove this function after you have imported the data once from old database to the new database.
*/
async function importData(users, configs) {
    // Removing the duplicate users and configs from the arrays
    users = users.filter((u, i) => users.findIndex((u2) => u2.guildId === u.guildId && u2.userId === u.userId) === i);
    configs = configs.filter((c, i) => configs.findIndex((c2) => c2.guildId === c.guildId) === i);
    
    // Getting the guilds from the old database
    const guildIds = [...new Set(users.map((u) => u.guildId))];

    // Looping through all guilds in the old database and importing the data.
    for (const guildId of guildIds) {
        await client.voiceTimeManager.create(guildId, {
            users: [users.filter((u) => u.guildId === guildId).map((u) => {
                return {
                    guildId: u.guildId,
                    userId: u.userId,
                    channels: u.voiceTime.channels.map((c) => {
                        return {
                            guildId: u.guildId,
                            channelId: c.channelId,
                            timeInChannel: c.voiceTime
                        };
                    }),
                    totalVoiceTime: u.voiceTime.total,
                    xp: u.levelingData.xp,
                    level: u.levelingData.level
                };
            })],
            config: configs.find((c) => c.guildId === guildId)
        });
    }
}

// eslint-disable-next-line no-restricted-globals
client.login(process.env.DISCORD_BOT_TOKEN);
