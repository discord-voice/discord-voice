const { EventEmitter } = require("events");
const merge = require("deepmerge");
const { writeFile, readFile, exists } = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(writeFile);
const existsAsync = promisify(exists);
const readFileAsync = promisify(readFile);
const Config = require("./Config.js");
const User = require("./User.js");
const { defaultManagerOptions, defaultConfig } = require("./Constants.js");
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

  async updateConfig(guildID, updatedConfig) {
    return new Promise(async (resolve, reject) => {
      updatedConfig =
        updatedConfig && typeof updatedConfig === "object"
          ? merge(defaultConfig, updatedConfig)
          : defaultConfig;
      if (!guildID) {
        return reject(`guildID is not valid. (val=${guildID})`);
      }
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
      if (user && user.member && user.channel && user.channel.members.has(user.id)) {
        let config = this.config.find(
          (g) => g.guildID === user.guild.id
        );
        if(!config) {
          this.manager.configs.push(
            new Config(this, {
              guildID: user.guild.id,
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
            })
          );
          await this.manager.saveConfig(this.guildID, {
            guildID: user.guild.id,
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
          });
          config = this.config.find((g) => g.guildID === user.guild.id);
        }
        if (!config.isEnabled || (!(await config.checkMember(user.member)) || !(await config.checkChannel(user.channel)))) return;
        let previousVoiceTime = user.data.voiceTime.channels.filter(
          (chn, indx) => {
            if (chn === user.channel.id) return { data: chn, index: indx };
          }
        );
        if (!previousVoiceTime.data) previousVoiceTime.data = 1;
        else previousVoiceTime.data += 1;
        user.data.voiceTime.channels[previousVoiceTime.index] =
          previousVoiceTime.data;
        await this.editUser(user.id, user.guild.id, user.data);
        return;
      }
    });
  }

  async _handleVoiceStateUpdate(oldState, newState) {
    if (!oldState.channel && newState.channel) {
      this.users.push(
        new User(this, {
          userID: newState.member.id,
          guildID: newState.member.guild.id,
          voiceTime: [],
        })
      );
      await this.manager.saveUser(
        newState.member.id,
        newState.member.guild.id,
        {
          userID: newState.member.id,
          guildID: newState.member.guild.id,
          voiceTime: [],
        }
      );
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
    }, this.options.updateCountdownEvery);
    this.ready = true;
    this.client.on("voiceStateUpdate", (oldState, newState) =>
      this._handleVoiceStateUpdate(oldState, newState)
    );
  }
}
