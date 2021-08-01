const { EventEmitter } = require("events");
const merge = require("deepmerge");
const { writeFile, readFile, exists } = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(writeFile);
const existsAsync = promisify(exists);
const readFileAsync = promisify(readFile);
const Config = require("./Config.js");
const User = require("./User.js");
const {
  defaultManagerOptions,
  defaultConfigData,
  defaultUserData,
} = require("./Constants.js");
class VoiceManager extends EventEmitter {
  constructor(client, options, init = true) {
    super();
    if (!client) throw new Error("Client is a required option.");
    this.client = client;
    this.ready = false;
    this.users = [];
    this.configs = [];
    this.options = merge(defaultManagerOptions, options);
    if (init) this._init();
  }

  createUser(userID, guildID, options) {
    return new Promise(async (resolve, reject) => {
      if (!this.ready) {
        return reject("The manager is not ready yet.");
      }
      options =
        options && typeof options === "object"
          ? merge(defaultUserData, options)
          : defaultUserData;
      if (!userID) {
        return reject(`userID is not a valid user. (val=${userID})`);
      }
      if (!guildID) {
        return reject(`guildID is not a valid guild. (val=${guildID})`);
      }
      const user = new User(this, {
        userID: userID,
        guildID: guildID,
        data: options,
      });
      this.users.push(user);
      await this.saveUser(userID, guildID, user.data);
      resolve(user);
    });
  }
  createConfig(guildID, options) {
    return new Promise(async (resolve, reject) => {
      if (!this.ready) {
        return reject("The manager is not ready yet.");
      }
      options =
        options && typeof options === "object"
          ? merge(defaultConfigData, options)
          : defaultConfigData;
      if (!guildID) {
        return reject(`guildID is not a valid guild. (val=${guildID})`);
      }
      const config = new Config(this, {
        guildID: guildID,
        data: options,
      });
      this.configs.push(config);
      await this.saveConfig(guildID, config.data);
      resolve(config);
    });
  }
  removeUser(userID, guildID) {
    return new Promise(async (resolve, reject) => {
      const user = this.users.find(
        (u) => u.guildID === guildID && u.userID === userID
      );
      if (!user) {
        return reject(
          "No user found with ID " +
            userID +
            " in guild with ID" +
            guildID +
            "."
        );
      }
      this.users = this.users.filter(
        (d) =>
          d !==
          {
            userID: userID,
            guildID: guildID,
            data: user.data.data,
          }
      );
      await this.deleteUser(messageID);
      resolve();
    });
  }
  removeConfig(guildID) {
    return new Promise(async (resolve, reject) => {
      const config = this.configs.find((c) => c.guildID === guildID);
      if (!config) {
        return reject("No config found for guild with ID " + guildID + ".");
      }
      this.configs = this.configs.filter((c) => c.guildID !== guildID);
      await this.deleteConfig(messageID);
      resolve();
    });
  }
  updateUser(userID, guildID, options = {}) {
    return new Promise(async (resolve, reject) => {
      const user = this.users.find(
        (u) => u.guildID === guildID && u.userID === userID
      );
      if (!user) {
        return reject(
          "No user found with ID " +
            userID +
            " in guild with ID" +
            guildID +
            "."
        );
      }
      user.edit(options).then(resolve).catch(reject);
    });
  }
  updateConfig(guildID, options = {}) {
    return new Promise(async (resolve, reject) => {
      const config = this.configs.find((c) => c.guildID === guildID);
      if (!config) {
        return reject("No config found for guild with ID " + guildID + ".");
      }
      config.edit(options).then(resolve).catch(reject);
    });
  }

  async deleteUser(userID, guildID) {
    await writeFileAsync(
      this.options.userStorage,
      JSON.stringify(this.users.map((user) => user.data)),
      "utf-8"
    );
    this.refreshUserStorage();
    return;
  }

  async deleteConfig(guildID) {
    await writeFileAsync(
      this.options.configStorage,
      JSON.stringify(this.configs.map((config) => config.data)),
      "utf-8"
    );
    this.refreshConfigStorage();
    return;
  }

  async refreshUserStorage() {
    return true;
  }

  async refreshConfigStorage() {
    return true;
  }

  async editUser(_userID, _guildID, _userData) {
    await writeFileAsync(
      this.options.userStorage,
      JSON.stringify(this.users.map((user) => user.data)),
      "utf-8"
    );
    this.refreshUserStorage();
    return;
  }

  async editConfig(_guildID, _configData) {
    await writeFileAsync(
      this.options.storage,
      JSON.stringify(this.configs.map((config) => config.data)),
      "utf-8"
    );
    this.refreshConfigStorage();
    return;
  }

  async saveUser(userID, guildID, userData) {
    await writeFileAsync(
      this.options.userStorage,
      JSON.stringify(this.users.map((user) => user.data)),
      "utf-8"
    );
    this.refreshUserStorage();
    return;
  }

  async saveConfig(guildID, configData) {
    await writeFileAsync(
      this.options.configStorage,
      JSON.stringify(this.configs.map((config) => config.data)),
      "utf-8"
    );
    this.refreshConfigStorage();
    return;
  }

  async getAllUsers() {
    const storageExists = await existsAsync(this.options.userStorage);
    if (!storageExists) {
      await writeFileAsync(this.options.userStorage, "[]", "utf-8");
      return [];
    } else {
      const storageContent = await readFileAsync(this.options.userStorage);
      try {
        const users = await JSON.parse(storageContent.toString());
        if (Array.isArray(users)) {
          return users;
        } else {
          console.log(storageContent, users);
          throw new SyntaxError(
            "The storage file is not properly formatted (users is not an array)."
          );
        }
      } catch (e) {
        if (e.message === "Unexpected end of JSON input") {
          throw new SyntaxError(
            "The storage file is not properly formatted (Unexpected end of JSON input)."
          );
        } else {
          throw e;
        }
      }
    }
  }

  async getAllConfigs() {
    const storageExists = await existsAsync(this.options.configStorage);
    if (!storageExists) {
      await writeFileAsync(this.options.configStorage, "[]", "utf-8");
      return [];
    } else {
      const storageContent = await readFileAsync(this.options.configStorage);
      try {
        const configs = await JSON.parse(storageContent.toString());
        if (Array.isArray(configs)) {
          return configs;
        } else {
          console.log(storageContent, configs);
          throw new SyntaxError(
            "The storage file is not properly formatted (configs is not an array)."
          );
        }
      } catch (e) {
        if (e.message === "Unexpected end of JSON input") {
          throw new SyntaxError(
            "The storage file is not properly formatted (Unexpected end of JSON input)."
          );
        } else {
          throw e;
        }
      }
    }
  }

  _checkUsers() {
    if (this.users.length <= 0) return;
    this.users.forEach(async (user) => {
      if (user && user.member && user.channel) {
        let config = this.configs.find((g) => g.guildID === user.guild.id);
        if (!config) {
          this.configs.push(
            new Config(this, {
              guildID: user.guild.id,
              data: {
                trackBots: false,
                trackAllChannels: true,
                exemptChannels: () => false,
                userLimit: 0,
                channelIDs: [],
                exemptPermissions: [],
                exemptMembers: () => false,
                trackMute: true,
                trackDeaf: true,
                isEnabled: true,
              },
            })
          );
          await this.saveConfig(this.guildID, {
            guildID: user.guild.id,
            data: {
              trackBots: false,
              trackAllChannels: true,
              exemptChannels: () => false,
              userLimit: 0,
              channelIDs: [],
              exemptPermissions: [],
              exemptMembers: () => false,
              trackMute: true,
              trackDeaf: true,
              isEnabled: true,
            },
          });
          config = this.configs.find((g) => g.guildID === user.guild.id);
        }
        if (
          !config.isEnabled ||
          !(await config.checkMember(user.member)) ||
          !(await config.checkChannel(user.channel))
        )
          return;
        if (user.voiceTime.channels.length <= 0) {
          user.voiceTime = {
            channels: [
              {
                channelID: user.channel.id,
                voiceTime: 1,
              },
            ],
            total: 1,
          };
          await this.editUser(user.id, user.guild.id, user.data);
          return;
        } else {
          let previousVoiceTime = user.voiceTime.channels.find(
            (chn) => chn.channelID === user.channel.id
          );
          let index = user.voiceTime.channels.indexOf(previousVoiceTime);
          if (!previousVoiceTime)
            previousVoiceTime = {
              channelID: user.channel.id,
              voiceTime: 1,
            };
          else previousVoiceTime.voiceTime += 1;
          if (index === -1) user.voiceTime.channels.push(previousVoiceTime);
          else user.voiceTime.channels[index] = previousVoiceTime;
          user.voiceTime.total = user.voiceTime.channels.reduce(function (
            sum,
            data
          ) {
            return sum + data.voiceTime;
          },
          0);
          await this.editUser(user.id, user.guild.id, user.data);
          return;
        }
      }
    });
  }

  async _handleVoiceStateUpdate(oldState, newState) {
    if (!oldState.channel && newState.channel) {
      if (!this.users.find((u) => u.userID === newState.member.id)) {
        this.users.push(
          new User(this, {
            userID: newState.member.id,
            guildID: newState.member.guild.id,
            data: {
              voiceTime: {
                channels: [],
                total: 0,
              },
            },
          })
        );
        await this.saveUser(newState.member.id, newState.member.guild.id, {
          userID: newState.member.id,
          guildID: newState.member.guild.id,
          data: {
            voiceTime: {
              channels: [],
              total: 0,
            },
          },
        });
      }
    }
  }

  async _init() {
    const rawUsers = await this.getAllUsers();
    rawUsers.forEach((user) => {
      this.users.push(new User(this, user));
    });
    const rawConfig = await this.getAllConfigs();
    rawConfig.forEach((config) => {
      this.configs.push(new Config(this, config));
    });
    setInterval(() => {
      if (this.client.readyAt) this._checkUsers.call(this);
    }, this.options.checkMembersEvery);
    this.ready = true;
    this.client.on("voiceStateUpdate", (oldState, newState) =>
      this._handleVoiceStateUpdate(oldState, newState)
    );
  }
}

module.exports = VoiceManager;
