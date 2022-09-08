import type { EventEmitter } from 'node:events';
import type {
    Client,
    Collection,
    GuildMember,
    PermissionResolvable,
    Snowflake,
    Awaitable,
    GuildChannel,
    Guild as DiscordGuild,
    VoiceChannel,
} from 'discord.js';

export const version: string;

export interface VoiceTimeManagerOptions<ExtraData> {
    storage?: string;
    deleteMissingGuilds?: boolean;
    default?: {
        trackBots?: boolean;
        trackAllChannels?: boolean;
        exemptChannels?: (channel: GuildChannel, guild: Guild<ExtraData>) => Awaitable<boolean>;
        channelIds?: Snowflake[];
        exemptPermissions?: PermissionResolvable[];
        exemptMembers?: (member: GuildMember, guild: Guild<ExtraData>) => Awaitable<boolean>;
        trackMute?: boolean;
        trackDeaf?: boolean;
        minUserCountToParticipate?: number;
        maxUserCountToParticipate?: number;
        minXpToParticipate?: number;
        minLevelToParticipate?: number;
        maxXpToParticipate?: number;
        maxLevelToParticipate?: number;
        xpAmountToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
        voiceTimeToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
        voiceTimeTrackingEnabled?: boolean;
        levelingTrackingEnabled?: boolean;
        levelMultiplier?: (guild: Guild<ExtraData>) => Awaitable<number>;
    };
}

export interface GuildCreateOptions<ExtraData = any> {
    users: UserData[];
    config: {
        trackBots?: boolean;
        trackAllChannels?: boolean;
        exemptChannels?: (channel: GuildChannel, guild: Guild<ExtraData>) => Awaitable<boolean>;
        channelIds?: Snowflake[];
        exemptPermissions?: PermissionResolvable[];
        exemptMembers?: (member: GuildMember, guild: Guild<ExtraData>) => Awaitable<boolean>;
        trackMute?: boolean;
        trackDeaf?: boolean;
        minUserCountToParticipate?: number;
        maxUserCountToParticipate?: number;
        minXpToParticipate?: number;
        minLevelToParticipate?: number;
        maxXpToParticipate?: number;
        maxLevelToParticipate?: number;
        xpAmountToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
        voiceTimeToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
        voiceTimeTrackingEnabled?: boolean;
        levelingTrackingEnabled?: boolean;
        levelMultiplier?: (guild: Guild<ExtraData>) => Awaitable<number>;
    };
}

export interface GuildEditOptions<ExtraData = any> {
    users?: UserData[];
    config?: {
        trackBots?: boolean;
        trackAllChannels?: boolean;
        exemptChannels?: (channel: GuildChannel, guild: Guild<ExtraData>) => Awaitable<boolean>;
        channelIds?: Snowflake[];
        exemptPermissions?: PermissionResolvable[];
        exemptMembers?: (member: GuildMember, guild: Guild<ExtraData>) => Awaitable<boolean>;
        trackMute?: boolean;
        trackDeaf?: boolean;
        minUserCountToParticipate?: number;
        maxUserCountToParticipate?: number;
        minXpToParticipate?: number;
        minLevelToParticipate?: number;
        maxXpToParticipate?: number;
        maxLevelToParticipate?: number;
        xpAmountToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
        voiceTimeToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
        voiceTimeTrackingEnabled?: boolean;
        levelingTrackingEnabled?: boolean;
        levelMultiplier?: (guild: Guild<ExtraData>) => Awaitable<number>;
    }
}

export interface UserEditOptions {
    channels?: ChannelData[];
    totalVoiceTime?: number;
    xp?: number;
    level?: number;
}

export interface ChannelEditOptions {
    timeInChannel?: number;
}

export interface ConfigEditOptions<ExtraData> {
    trackBots?: boolean;
    trackAllChannels?: boolean;
    exemptChannels?: (channel: GuildChannel, guild: Guild<ExtraData>) => Awaitable<boolean>;
    channelIds?: Snowflake[];
    exemptPermissions?: PermissionResolvable[];
    exemptMembers?: (member: GuildMember, guild: Guild<ExtraData>) => Awaitable<boolean>;
    trackMute?: boolean;
    trackDeaf?: boolean;
    minUserCountToParticipate?: number;
    maxUserCountToParticipate?: number;
    minXpToParticipate?: number;
    minLevelToParticipate?: number;
    maxXpToParticipate?: number;
    maxLevelToParticipate?: number;
    xpAmountToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
    voiceTimeToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
    voiceTimeTrackingEnabled?: boolean;
    levelingTrackingEnabled?: boolean;
    levelMultiplier?: (guild: Guild<ExtraData>) => Awaitable<number>;
}

export interface GuildData<ExtraData = any> {
    guildId: Snowflake;
    users: UserData[];
    config: ConfigData<ExtraData>;
    extraData: ExtraData;
}

export interface UserData {
    guildId: Snowflake;
    userId: Snowflake;
    channels: ChannelData[];
    totalVoiceTime: number;
    xp: number;
    level: number;
}

export interface ChannelData {
    guildId: Snowflake;
    channelId: Snowflake;
    timeInChannel: number;
}

export interface ConfigData<ExtraData> {
    trackBots: boolean;
    trackAllChannels: boolean;
    exemptChannels: (channel: GuildChannel, guild: Guild<ExtraData>) => Awaitable<boolean>;
    channelIds: Snowflake[];
    exemptPermissions: PermissionResolvable[];
    exemptMembers: (member: GuildMember, guild: Guild<ExtraData>) => Awaitable<boolean>;
    trackMute: boolean;
    trackDeaf: boolean;
    minUserCountToParticipate: number;
    maxUserCountToParticipate: number;
    minXpToParticipate: number;
    minLevelToParticipate: number;
    maxXpToParticipate: number;
    maxLevelToParticipate: number;
    xpAmountToAdd: (guild: Guild<ExtraData>) => Awaitable<number>;
    voiceTimeToAdd: (guild: Guild<ExtraData>) => Awaitable<number>;
    voiceTimeTrackingEnabled: boolean;
    levelingTrackingEnabled: boolean;
    levelMultiplier: (guild: Guild<ExtraData>) => Awaitable<number>;
}

export interface DefaultConfigOptions<ExtraData>  {
    trackBots?: boolean;
    trackAllChannels?: boolean;
    exemptChannels?: (channel: GuildChannel, guild: Guild<ExtraData>) => Awaitable<boolean>;
    channelIds?: Snowflake[];
    exemptPermissions?: PermissionResolvable[];
    exemptMembers?: (member: GuildMember, guild: Guild<ExtraData>) => Awaitable<boolean>;
    trackMute?: boolean;
    trackDeaf?: boolean;
    minUserCountToParticipate?: number;
    maxUserCountToParticipate?: number;
    minXpToParticipate?: number;
    minLevelToParticipate?: number;
    maxXpToParticipate?: number;
    maxLevelToParticipate?: number;
    xpAmountToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
    voiceTimeToAdd?: (guild: Guild<ExtraData>) => Awaitable<number>;
    voiceTimeTrackingEnabled?: boolean;
    levelingTrackingEnabled?: boolean;
    levelMultiplier?: (guild: Guild<ExtraData>) => Awaitable<number>;
}

export interface VoiceTimeManagerEvents<ExtraData = any> {
    userXpAdd: [User, User];
    userLevelUp: [User, User];
    userVoiceTimeAdd: [User, User];
}

export class VoiceTimeManager<ExtraData = any> extends EventEmitter {
    constructor(client: Client, options?: VoiceTimeManagerOptions<ExtraData>, init?: boolean);

    public client: Client;
    public ready: boolean;
    public guilds: Collection<Snowflake, Guild<ExtraData>>;
    public options: VoiceTimeManagerOptions<ExtraData>;

    public create(guildId: Snowflake, options?: GuildCreateOptions<ExtraData>): Promise<Guild<ExtraData>>;
    public edit(guildId: Snowflake, options: GuildEditOptions<ExtraData>): Promise<Guild<ExtraData>>;
    public delete(guildId: Snowflake): Promise<Guild<ExtraData>>;

    public delete(guildId: Snowflake, doNotDeleteMessage?: boolean): Promise<Guild<ExtraData>>;
    public deleteGuild(guildId: Snowflake): Promise<boolean>;

    public on<K extends keyof VoiceTimeManagerEvents<ExtraData>>(
        event: K,
        listener: (...args: VoiceTimeManagerEvents<ExtraData>[K]) => void
    ): this;

    public once<K extends keyof VoiceTimeManagerEvents<ExtraData>>(
        event: K,
        listener: (...args: VoiceTimeManagerEvents<ExtraData>[K]) => void
    ): this;

    public emit<K extends keyof VoiceTimeManagerEvents<ExtraData>>(
        event: K,
        ...args: VoiceTimeManagerEvents<ExtraData>[K]
    ): boolean;
}

export class Guild<ExtraData = any> extends EventEmitter {
    constructor(manager: VoiceTimeManager<ExtraData>, guildId: Snowflake, options: GuildData<ExtraData>);

    public manager: VoiceTimeManager<ExtraData>;
    public client: Client;
    public guildId: Snowflake;
    public users: Collection<Snowflake, User>;
    public config: Config<ExtraData>;
    public extraData: ExtraData;
    public options: GuildData<ExtraData>;

    readonly guild: DiscordGuild;
    readonly data: GuildData<ExtraData>;

    public edit(options: GuildEditOptions<ExtraData>): Promise<Guild<ExtraData>>;
}

export class User<ExtraData = any> extends EventEmitter {
    constructor(manager: VoiceTimeManager<ExtraData>, guild: Guild, options: UserData);

    public manager: VoiceTimeManager<ExtraData>;
    public client: Client;
    public guild: Guild;
    public guildId: Snowflake;
    public userId: Snowflake;
    public channels: Collection<Snowflake, Channel>;
    public totalVoiceTime: number;
    public xp: number;
    public level: number;
    public options: UserData;

    readonly data: UserData;

    public edit(options: UserEditOptions): Promise<User>;
    public delete(): Promise<User>;
}

export class Channel extends EventEmitter {
    constructor(manager: VoiceTimeManager, guild: Guild, user: User, options: ChannelData);
    
    public manager: VoiceTimeManager;
    public client: Client;
    public guild: Guild;
    public guildId: Snowflake;
    public channelId: Snowflake;
    public timeInChannel: number;
    public options: ChannelData;

    readonly data: ChannelData;

    public edit(options: ChannelEditOptions): Promise<Channel>;
    public delete(): Promise<Channel>;
}

export class Config<ExtraData = any> extends EventEmitter {
    constructor(manager: VoiceTimeManager, guild: Guild, options: ConfigData<ExtraData>);

    public manager: VoiceTimeManager;
    public client: Client;
    public guild: Guild;
    public guildId: Snowflake;
    public options: ConfigData<ExtraData>;

    readonly trackBots: boolean;
    readonly trackMute: boolean;
    readonly trackDeaf: boolean;
    readonly trackAllChannels: boolean;
    readonly minUserCountToParticipate: number;
    readonly maxUserCountToParticipate: number;
    readonly minXpToParticipate: number;
    readonly minLevelToParticipate: number;
    readonly maxXpToParticipate: number;
    readonly maxLevelToParticipate: number;
    readonly voiceTimeTrackingEnabled: boolean;
    readonly levelingTrackingEnabled: boolean;
    readonly exemptPermissions: PermissionResolvable[];
    readonly exemptMembersFunction: Function | null;
    readonly exemptChannelsFunction: Function | null;
    readonly xpAmountToAddFunction: Function | null;
    readonly voiceTimeToAddFunction: Function | null;
    readonly data: ConfigData<ExtraData>;

    public exemptMembers(member: GuildMember): Promise<boolean>;
    public exemptChannels(channel: VoiceChannel): Promise<boolean>;
    public xpAmountToAdd(): Promise<number>;
    public voiceTimeToAdd(): Promise<number>;
    public edit(options: ConfigEditOptions<ExtraData>): Promise<Config>;
}

