const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildVoiceStates]
});

// Load mysql
const MySQL = require('mysql');
const sql = MySQL.createConnection({
    host: 'localhost',
    user: 'Your MySQL user',
    password: 'Your MySQL password',
    database: 'Your MySQL database name',
    charset: 'utf8mb4' // In order to save emojis correctly
});
sql.connect((err) => {
    if (err) {
        // Stop the process if we can't connect to the MySQL server
        throw new Error('Impossible to connect to MySQL server. Code: ' + err.code);
    } else {
        console.log('[SQL] Connected to the MySQL server! Connection ID: ' + sql.threadId);
    }
});

// Create guilds table
sql.query(
    `
	CREATE TABLE IF NOT EXISTS \`guilds\`
	(
		\`id\` INT(1) NOT NULL AUTO_INCREMENT,
		\`guild_id\` VARCHAR(20) NOT NULL,
		\`data\` JSON NOT NULL,
		PRIMARY KEY (\`id\`)
	);
`,
    (err) => {
        if (err) console.error(err);
        console.log('[SQL] Created table `guilds`');
    }
);

const { VoiceTimeManager } = require('discord-voice');
const VoiceTimeManagerWithOwnDatabase = class extends VoiceTimeManager {
    // This function is called when the manager needs to get all guilds which are stored in the database.
    async getAllGuilds() {
        return new Promise((resolve, reject) => {
            sql.query('SELECT `data` FROM `guilds`', (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                const guilds = res.map((row) =>
                    JSON.parse(row.data, (_, v) =>
                        typeof v === 'string' && /BigInt\("(-?\d+)"\)/.test(v) ? eval(v) : v
                    )
                );
                resolve(guilds);
            });
        });
    }

    // This function is called when a guild needs to be saved in the database.
    async saveGuild(guildId, guildData) {
        return new Promise((resolve, reject) => {
            sql.query(
                'INSERT INTO `guilds` (`guild_id`, `data`) VALUES (?,?)',
                [guildId, JSON.stringify(guildData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v))],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    // This function is called when a guild needs to be edited in the database.
    async editGuild(guildId, guildData) {
        return new Promise((resolve, reject) => {
            sql.query(
                'UPDATE `guilds` SET `data` = ? WHERE `guild_id` = ?',
                [JSON.stringify(guildData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v)), guildId],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    // This function is called when a guild needs to be deleted from the database.
    async deleteGuild(guildId) {
        return new Promise((resolve, reject) => {
            sql.query('DELETE FROM `guilds` WHERE `guild_id` = ?', guildId, (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
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
