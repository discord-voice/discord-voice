export class DiscordVoice{

public setURL(dbUrl:string);
public createUser(userId:string, guildId:string);
public deleteUser(userId:string, guildId:string);
public start(client:any, trackbots:boolean, trackallchannels:boolean, channelID:string);
public setVoiceTime(userId:string, guildId:string, voicetime:number);
public fetch(userId:string, guildId:string, fetchPosition:boolean);
public addVoiceTime(userId:string, guildId:string, voicetime:number);
public subtractVoiceTime(userId:string, guildId:string, voicetime:number);
public fetchLeaderboard(guildId:string, limit:number);
public computeLeaderboard(client:any, leaderboard:any, fetchUsers:boolean);
}