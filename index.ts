import { TeamSpeak, QueryProtocol, TeamSpeakChannel, ConnectionParams } from "ts3-nodejs-library"
import { Whoami } from "ts3-nodejs-library/lib/types/ResponseTypes";
import * as fs from "fs";

// get teamspeak account
fs.readFile('./ts3Account.json', 'utf8', connectServer)

/**
 * connoect to server after we get the bot account info
 * @param err err response
 * @param accounts client account info
 */
function connectServer(err: NodeJS.ErrnoException | null, accounts: string) {
    if (err) throw err;
    const accountsConfigs: Partial<ConnectionParams>[] = JSON.parse(accounts);
    const teamspeak = new TeamSpeak(accountsConfigs[0])
    let botInfo: Whoami;
    let channelList: TeamSpeakChannel[];

    teamspeak.connect();

    teamspeak.on("ready", async () => {
        //teamspeak connected successfully

        // get botInfo
        await teamspeak.whoami().then(res => botInfo = res)

        // get channelList
        await teamspeak.channelList().then(res => channelList = res)

        // regist events
        Promise.all([
            teamspeak.registerEvent("server"),
            teamspeak.registerEvent("channel", 0),
            teamspeak.registerEvent("textserver"),
            teamspeak.registerEvent("textchannel"),
            teamspeak.registerEvent("textprivate"),
        ])
    })

    teamspeak.on("error", (err) => {
        //teamspeak had an error
        console.log(`----------------------teamspeak error--start------------------`);
        console.log(err);
        console.log(`----------------------teamspeak error--end------------------`);
    })



    teamspeak.on("textmessage", ev => {
        const recieveMsg = ev.msg;
        const targetmode = ev.targetmode;
        const channelGroupId = ev.invoker.channelGroupId;

        // guard check
        if (recieveMsg.indexOf('!') !== 0) { return; }
        if (channelGroupId === null || channelGroupId === undefined) { return; }

        // bot say 0.0
        if (recieveMsg.indexOf('?') === 1) {
            teamspeak.sendTextMessage(channelGroupId, targetmode, `0.0?!`)
        }

        // google search keyword
        if (recieveMsg.indexOf('google') === 1) {
            const keyword = recieveMsg.slice(8);
            teamspeak.sendTextMessage(channelGroupId, targetmode, `[url=https://www.google.com/search?q=${keyword}&oq=${keyword}]${keyword}[/url]`);
        }

        // show channel list
        if (recieveMsg.indexOf('channelList') === 1 || recieveMsg.indexOf('頻道列表') === 1) {
            teamspeak.sendTextMessage(channelGroupId, targetmode, `channel id list: ${JSON.stringify(channelList, null, '  ')}`)
        }

        // show bot info
        if (recieveMsg.indexOf('botInfo') === 1 || recieveMsg.indexOf('機器人資訊') === 1) {
            teamspeak.sendTextMessage(channelGroupId, targetmode, JSON.stringify(botInfo, null, '  '))
        }

        // bot move to target channel
        if (
            recieveMsg.indexOf('botMove') === 1 ||
            recieveMsg.indexOf('機器人去') === 1
        ) {
            const sliceStart = recieveMsg.indexOf('botMove') === 1 ? 9 : 6;
            const targetChannelName = recieveMsg.slice(sliceStart);
            console.log(`targetChannelName: `, targetChannelName);
            const clientId = botInfo.client_id;
            const targetChannels = channelList.filter(channel => channel.name === targetChannelName);
            const targetChannelId = targetChannels && targetChannels.length > 0 ? targetChannels[0].cid : null;

            if (targetChannelId !== null) {
                teamspeak.sendTextMessage(botInfo.client_channel_id, 2, 'bot 走惹')
                teamspeak.clientMove(clientId, targetChannelId);
                teamspeak.sendTextMessage(targetChannelId, 2, 'bot 來惹')
            }
        }

        // client move to target channel
        if (
            recieveMsg.indexOf('move') === 1 ||
            recieveMsg.indexOf('去') === 1
        ) {
            const sliceStart = recieveMsg.indexOf('move') === 1 ? 6 : 3;
            const targetChannelName = recieveMsg.slice(sliceStart);
            console.log(`targetChannelName: `, targetChannelName);
            const clientId = ev.invoker.clid;
            const targetChannels = channelList.filter(channel => channel.name === targetChannelName);
            const targetChannelId = targetChannels && targetChannels.length > 0 ? targetChannels[0].cid : null;

            if (targetChannelId !== null) {
                teamspeak.clientMove(clientId, targetChannelId);
            }
        }

        // console.log(`${ev.invoker.nickname} just send the message "${ev.msg}"`)
    })
}

