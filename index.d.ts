export class DiscordVoice{

public setURL(dbUrl:string): object;
public createUser(userId:string, guildId:string): object;
public deleteUser(userId:string, guildId:string): object;
public start(client:any, trackbots:boolean, trackallchannels:boolean, userlimit:number, channelID:string): object;
public setVoiceTime(userId:string, guildId:string, voicetime:number): object;
public fetch(userId:string, guildId:string, fetchPosition:boolean): object;
public addVoiceTime(userId:string, guildId:string, voicetime:number): object;
public subtractVoiceTime(userId:string, guildId:string, voicetime:number): object;
public resetGuild(guildId:string): object;
public fetchLeaderboard(guildId:string, limit:number): object;
public computeLeaderboard(client:any, leaderboard:any, fetchUsers:boolean): object;
public blacklist(userId:string, guildId:string): object;
public unblacklist(userId:string, guildId:string): object;
}