import { TeamSpeak, QueryProtocol, TeamSpeakChannel, ConnectionParams, TextMessageTargetMode } from "ts3-nodejs-library"
import { Whoami } from "ts3-nodejs-library/lib/types/ResponseTypes";
import * as fs from "fs";
import { TextMessage } from "ts3-nodejs-library/lib/types/Events";

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

    // connect to target server by config
    teamspeak.connect().catch(err=>{
        console.log(`----------------------connect error--start------------------`);
        console.log(err);
        console.log(`----------------------connect error--end------------------`);
    });

    // bot init
    teamspeak.on("ready", async () => {

        // get botInfo
        await teamspeak.whoami().then(res => botInfo = res);

        // get channelList
        await teamspeak.channelList().then(res => channelList = res);

        // notice chennal that bot login
        teamspeak.sendTextMessage(
            botInfo.client_channel_id,
            TextMessageTargetMode.CHANNEL,
            `${botInfo.client_login_name} is login now.`
        );

        // regist events
        registTeamspeakEvents(teamspeak);
    })

    // bot close
    teamspeak.on("close", async()=>{
        console.log("disconnected, trying to reconnect...")
        await teamspeak.reconnect(-1, 1000)
        console.log("reconnected!")
    })

    // bot error
    teamspeak.on("error", (err) => {
        //teamspeak had an error
        console.log(`----------------------teamspeak error--start------------------`);
        console.log(err);
        console.log(`----------------------teamspeak error--end------------------`);
    })


    // bot recive message then do something
    teamspeak.on("textmessage", ev => {
        const recieveMsg = ev.msg;
        const targetmode = ev.targetmode;
        const channelGroupId = ev.invoker.channelGroupId;

        // guard check
        if (recieveMsg.indexOf('!') !== 0) { return; }
        if (channelGroupId === null || channelGroupId === undefined) { return; }

        // bot say 0.0
        // if (recieveMsg.indexOf('?') === 1) {
        //     teamspeak.sendTextMessage(channelGroupId, targetmode, `0.0?!`)
        // }
        botSayNani(teamspeak, recieveMsg, channelGroupId, targetmode);

        // dnd roll
        botDice(teamspeak, recieveMsg, channelGroupId, targetmode, ev);

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

/**
 * regist the Teamspeak events which want to be callback
 * @param teamspeak Teamspeak Object with your config
 */
function registTeamspeakEvents(teamspeak: TeamSpeak) {
    return Promise.all([
        teamspeak.registerEvent("server"),
        teamspeak.registerEvent("channel", 0),
        teamspeak.registerEvent("textserver"),
        teamspeak.registerEvent("textchannel"),
        teamspeak.registerEvent("textprivate"),
    ])
}

/**
 * bot command format sample: !google Something
 * bot command format : 'cmdSymbol''cmd' 'param'
 * @param textMsgObj the response object when teamspeak event "textmessage" effcet
 */
function botOnRecieveMsg(textMsgObj: TextMessage) {

    // set common const
    const recieveMsg = textMsgObj.msg.trim();
    const channelGroupId = textMsgObj.invoker.channelGroupId;

    // set bot config
    const cmdSymbol = '!';

    // guard check
    if (recieveMsg.indexOf(cmdSymbol) !== 0) { return; } // bot cmd symbol check
    if (channelGroupId === null || channelGroupId === undefined) { return; } // channel id exist



}

class BotCmd {
    cmdSymbol: string = '!';
    cmdKeywords: string[] = [];
    cmdParam: string[] = [];
    cmdResponse: Function = function (recieveMsg: string) { };
    teamspeak: TeamSpeak;

    constructor(
        teamspeak: TeamSpeak,
        cmdSymbol: string,
        cmdKeywords: string[],
        cmdParam: string[],
        cmdResponse: Function
    ) {
        this.cmdSymbol = cmdSymbol;
        this.cmdKeywords = cmdKeywords;
        this.cmdParam = cmdParam;
        this.cmdResponse = cmdResponse;
        this.teamspeak = teamspeak;
    }
}

function botSayNani(teamspeak: TeamSpeak, recieveMsg: string, channelGroupId: number, targetmode: number) {

    // set BotCmd Obj
    let botCmd = new BotCmd(
        teamspeak,
        '!',
        ['?'],
        [],
        function (recieveMsg: string) {
            teamspeak.sendTextMessage(channelGroupId, targetmode, `0.0?!`)
        }
    )

    // parse cmd line and parse msg
    const regexpRule = new RegExp(`(^${botCmd.cmdSymbol})(\\${botCmd.cmdKeywords})`)
    const isEffect = regexpRule.test(recieveMsg);
    const textParse = isEffect ? recieveMsg.match(regexpRule) : null;
    const recieveParam = textParse ? textParse[3] : null;

    // response
    if (isEffect) {
        botCmd.cmdResponse(recieveMsg);
    }

}


/**
 * bot to dice with dnd rule
 * @param teamspeak 
 * @param recieveMsg 
 * @param channelGroupId 
 * @param targetmode 
 * @param ev 
 */
function botDice(teamspeak: TeamSpeak, recieveMsg: string, channelGroupId: number, targetmode: number, ev: TextMessage) {
 
    const askerName = ev.invoker.nickname;

    // set BotCmd Obj
    let botCmd = new BotCmd(
        teamspeak,
        '!',
        ['roll'], // TODO: 讓正則表達支援 array 關鍵字判斷, 任一
        [],
        function (msg: string) {

            // dnd roll parse rule
            const regexpRule = /(?:\((?<number>\d+)d(?<value>\d+)\)(?:(?<prefix>[\+\-])(?<bonus>\d+))?)/;
            const isEffect = regexpRule.test(recieveMsg);
            const textParse = isEffect ? recieveMsg.match(regexpRule) : null;

            // teamspeak.sendTextMessage(channelGroupId, targetmode, msg)
            // teamspeak.sendTextMessage(channelGroupId, targetmode, textParse[0])
            // teamspeak.sendTextMessage(channelGroupId, targetmode, (msg===textParse[0])?'true':'false')
            // teamspeak.sendTextMessage(channelGroupId, targetmode, JSON.stringify(textParse, null, '  '))

            if (!textParse || msg !== textParse[0] || !textParse.groups) { return; }

            // dice qty
            const theNumber = Number(textParse.groups.number) || 0;
            // dice range 1~n
            const theValue = Number(textParse.groups.value) || 0;
            // 計算符號
            const thePrefix = textParse.groups.prefix ? textParse.groups.prefix : null;
            // bonus number
            const theBonus = textParse.groups.bonus ? Number(textParse.groups.bonus) : 0;

            // calculate the random result
            let res = dndBasicDice(theNumber, theValue)
            switch (thePrefix) {
                case '+':
                    res += theBonus;
                    break;
                case '-':
                    res -= theBonus;
                    break;
                default:
                    break;
            }

            // send Message
            const sendMsg = `
                [size=24][color=blue]${askerName}[/color] 要求擲骰 ${msg}[/size] : [size=32][color=#fa36cc]${res.toString()}[/color][/size]
            `;
            teamspeak.sendTextMessage(channelGroupId, targetmode, sendMsg)
        }
    )

    // parse cmd line and parse msg
    const regexpRule = new RegExp(`(^${botCmd.cmdSymbol})(${botCmd.cmdKeywords}) (.*)`)
    const isEffect = regexpRule.test(recieveMsg);
    const textParse = isEffect ? recieveMsg.match(regexpRule) : null;
    const recieveParam = textParse ? textParse[3] : null;

    
    // response
    if (isEffect) {
        // teamspeak.sendTextMessage(channelGroupId, targetmode, JSON.stringify(textParse, null, '  '))
        botCmd.cmdResponse(recieveParam);
    }

}

/**
 * random calculate with dnd rule
 * @param diceQty 
 * @param diceRange 
 * @param beginningNumber 
 */
function dndBasicDice(diceQty: number, diceRange: number, beginningNumber: number = 0): number {
    const randomNumber = Math.floor((Math.random() * diceRange) + 1);
    // console.log(randomNumber);

    if (diceQty > 0) {
        return dndBasicDice(diceQty - 1, diceRange, beginningNumber + randomNumber)
    }
    return beginningNumber;
}


// let totalArr = Array(12).fill(0);

// for(let i=1;i<=10000;i++){
//     let res = Math.floor((dndBasicDice(1,100,0)-1)/10);
//     res<0 ? totalArr[10]++ :
//     res>10 ? totalArr[11]++ :
//     totalArr[res]++;
//     // totalArr = totalArr.concat([]);
// }

// console.log(`totalArr: `,totalArr);

