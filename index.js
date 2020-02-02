"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// //import with typescript
var ts3_nodejs_library_1 = require("ts3-nodejs-library");
// import * as axios from "axios";
var fs = require("fs");
// //import with javascript
// //const { TeamSpeak } = require("ts3-nodejs-library")
// // console.log(`start-------`);
//create a new connection
// TeamSpeak.connect({
//     host: "127.0.0.1",
//     // host: "140.121.80.175",
//     protocol: QueryProtocol.RAW, //optional
//     queryport: 10011, //optional
//     serverport: 9987,
//     username: "serveradmin",
//     // password: "210310",
//     password: "TtUzifTr",
//     nickname: "NodeJS Query Framework",
//     keepAlive: true,
// }).then(async teamspeak => {
//     // console.log(`connect result: `, teamspeak);
//     const clients = await teamspeak.clientList({ client_type: 0 })
//     clients.forEach(client => {
//         console.log("Sending 'Hello!' Message to", client.nickname)
//         client.message("Hello!")
//     })
// }).catch(e => {
//     console.log("Catched an error!")
//     console.error(e)
// })
// import { TeamSpeak } from "ts3-nodejs-library"
// axios def
// const aGet = axios.default.get;
// const aPost = axios.default.post;
// const aPatch = axios.default.patch;
// const aDelete = axios.default.delete;
// const axiosLocalConfig = {
//     baseURL: 'https://127.0.0.1:10011'
// }
// get teamspeak account
// let ts3Accounts;
fs.readFile('./ts3Account.json', 'utf8', connectServer);
/**
 * connoect to server after we get the bot account info
 * @param err err response
 * @param accounts client account info
 */
function connectServer(err, accounts) {
    var _this = this;
    if (err)
        throw err;
    var accountsConfigs = JSON.parse(accounts);
    var teamspeak = new ts3_nodejs_library_1.TeamSpeak(accountsConfigs[0]);
    var botInfo;
    var channelList;
    teamspeak.connect();
    teamspeak.on("ready", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                //teamspeak connected successfully
                // get botInfo
                return [4 /*yield*/, teamspeak.whoami().then(function (res) { return botInfo = res; })
                    // get channelList
                ];
                case 1:
                    //teamspeak connected successfully
                    // get botInfo
                    _a.sent();
                    // get channelList
                    return [4 /*yield*/, teamspeak.channelList().then(function (res) { return channelList = res; })
                        // regist events
                    ];
                case 2:
                    // get channelList
                    _a.sent();
                    // regist events
                    Promise.all([
                        teamspeak.registerEvent("server"),
                        teamspeak.registerEvent("channel", 0),
                        teamspeak.registerEvent("textserver"),
                        teamspeak.registerEvent("textchannel"),
                        teamspeak.registerEvent("textprivate"),
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    teamspeak.on("error", function (err) {
        //teamspeak had an error
        console.log("----------------------teamspeak error--start------------------");
        console.log(err);
        console.log("----------------------teamspeak error--end------------------");
    });
    teamspeak.on("textmessage", function (ev) {
        var recieveMsg = ev.msg;
        var targetmode = ev.targetmode;
        var channelGroupId = ev.invoker.channelGroupId;
        // guard check
        if (recieveMsg.indexOf('!') !== 0) {
            return;
        }
        if (channelGroupId === null || channelGroupId === undefined) {
            return;
        }
        // bot say 0.0
        if (recieveMsg.indexOf('?') === 1) {
            teamspeak.sendTextMessage(channelGroupId, targetmode, "0.0?!");
        }
        // google search keyword
        if (recieveMsg.indexOf('google') === 1) {
            var keyword = recieveMsg.slice(8);
            teamspeak.sendTextMessage(channelGroupId, targetmode, "[url=https://www.google.com/search?q=" + keyword + "&oq=" + keyword + "]" + keyword + "[/url]");
        }
        // show channel list
        if (recieveMsg.indexOf('channelList') === 1 || recieveMsg.indexOf('頻道列表') === 1) {
            teamspeak.sendTextMessage(channelGroupId, targetmode, "channel id list: " + JSON.stringify(channelList, null, '  '));
        }
        // show bot info
        if (recieveMsg.indexOf('botInfo') === 1 || recieveMsg.indexOf('機器人資訊') === 1) {
            teamspeak.sendTextMessage(channelGroupId, targetmode, JSON.stringify(botInfo, null, '  '));
        }
        // bot move to target channel
        if (recieveMsg.indexOf('botMove') === 1 ||
            recieveMsg.indexOf('機器人去') === 1) {
            var sliceStart = recieveMsg.indexOf('botMove') === 1 ? 9 : 6;
            var targetChannelName_1 = recieveMsg.slice(sliceStart);
            console.log("targetChannelName: ", targetChannelName_1);
            var clientId = botInfo.client_id;
            var targetChannels = channelList.filter(function (channel) { return channel.name === targetChannelName_1; });
            var targetChannelId = targetChannels && targetChannels.length > 0 ? targetChannels[0].cid : null;
            if (targetChannelId !== null) {
                teamspeak.sendTextMessage(botInfo.client_channel_id, 2, 'bot 走惹');
                teamspeak.clientMove(clientId, targetChannelId);
                teamspeak.sendTextMessage(targetChannelId, 2, 'bot 來惹');
            }
        }
        // client move to target channel
        if (recieveMsg.indexOf('move') === 1 ||
            recieveMsg.indexOf('去') === 1) {
            var sliceStart = recieveMsg.indexOf('move') === 1 ? 6 : 3;
            var targetChannelName_2 = recieveMsg.slice(sliceStart);
            console.log("targetChannelName: ", targetChannelName_2);
            var clientId = ev.invoker.clid;
            var targetChannels = channelList.filter(function (channel) { return channel.name === targetChannelName_2; });
            var targetChannelId = targetChannels && targetChannels.length > 0 ? targetChannels[0].cid : null;
            if (targetChannelId !== null) {
                teamspeak.clientMove(clientId, targetChannelId);
            }
        }
        // console.log(`${ev.invoker.nickname} just send the message "${ev.msg}"`)
    });
}
// aGet('/ts3Account.json', axiosLocalConfig)
//     .then(accounts => {
//         console.log(`accounts: `, accounts, typeof (accounts));
//         // const teamspeak = new TeamSpeak(accounts[0])
//     })
// fetch('./ts3Account.json')
//     // .then(accounts => ts3Accounts=accounts)
//     .then(accounts => {
//         console.log(`accounts: `, accounts, typeof (accounts));
//         // const teamspeak = new TeamSpeak(accounts[0])
//     })
// const teamspeak = new TeamSpeak(ts3Accounts[0])
// const teamspeak = new TeamSpeak({
//     host: "127.0.0.1",
//     // host: "140.121.80.175",
//     protocol: QueryProtocol.RAW, //optional
//     queryport: 10011, //optional
//     serverport: 9987,
//     username: "serveradmin",
//     // password: "210310",
//     password: "TtUzifTr",
//     nickname: "Shadow Bot",
//     keepAlive: true,
// })
// let botInfo: Whoami;
// let channelList: TeamSpeakChannel[];
// teamspeak.connect();
// teamspeak.on("ready", async () => {
//     //teamspeak connected successfully
//     // get botInfo
//     await teamspeak.whoami().then(res => botInfo = res)
//     // get channelList
//     await teamspeak.channelList().then(res => channelList = res)
//     // regist events
//     Promise.all([
//         teamspeak.registerEvent("server"),
//         teamspeak.registerEvent("channel", 0),
//         teamspeak.registerEvent("textserver"),
//         teamspeak.registerEvent("textchannel"),
//         teamspeak.registerEvent("textprivate"),
//     ])
// })
// teamspeak.on("error", () => {
//     //teamspeak had an error
// })
// teamspeak.on("textmessage", ev => {
//     const recieveMsg = ev.msg;
//     const targetmode = ev.targetmode;
//     const channelGroupId = ev.invoker.channelGroupId;
//     // guard check
//     if (recieveMsg.indexOf('!') !== 0) { return; }
//     if (channelGroupId === null || channelGroupId === undefined) { return; }
//     // bot say 0.0
//     if (recieveMsg.indexOf('?') === 1) {
//         teamspeak.sendTextMessage(channelGroupId, targetmode, `0.0?!`)
//     }
//     // google search keyword
//     if (recieveMsg.indexOf('google') === 1) {
//         const keyword = recieveMsg.slice(8);
//         teamspeak.sendTextMessage(channelGroupId, targetmode, `[url=https://www.google.com/search?q=${keyword}&oq=${keyword}]${keyword}[/url]`);
//     }
//     // show channel list
//     if (recieveMsg.indexOf('channelList') === 1 || recieveMsg.indexOf('頻道列表') === 1) {
//         teamspeak.sendTextMessage(channelGroupId, targetmode, `channel id list: ${JSON.stringify(channelList, null, '  ')}`)
//     }
//     // show bot info
//     if (recieveMsg.indexOf('botInfo') === 1 || recieveMsg.indexOf('機器人資訊') === 1) {
//         teamspeak.sendTextMessage(channelGroupId, targetmode, JSON.stringify(botInfo, null, '  '))
//     }
//     // bot move to target channel
//     if (
//         recieveMsg.indexOf('botMove') === 1 ||
//         recieveMsg.indexOf('機器人去') === 1
//     ) {
//         const sliceStart = recieveMsg.indexOf('botMove') === 1 ? 9 : 6;
//         const targetChannelName = recieveMsg.slice(sliceStart);
//         console.log(`targetChannelName: `, targetChannelName);
//         const clientId = botInfo.client_id;
//         const targetChannels = channelList.filter(channel => channel.name === targetChannelName);
//         const targetChannelId = targetChannels && targetChannels.length > 0 ? targetChannels[0].cid : null;
//         if (targetChannelId !== null) {
//             teamspeak.sendTextMessage(botInfo.client_channel_id, 2, 'bot 走惹')
//             teamspeak.clientMove(clientId, targetChannelId);
//             teamspeak.sendTextMessage(targetChannelId, 2, 'bot 來惹')
//         }
//     }
//     // client move to target channel
//     if (
//         recieveMsg.indexOf('move') === 1 ||
//         recieveMsg.indexOf('去') === 1
//     ) {
//         const sliceStart = recieveMsg.indexOf('move') === 1 ? 6 : 3;
//         const targetChannelName = recieveMsg.slice(sliceStart);
//         console.log(`targetChannelName: `, targetChannelName);
//         const clientId = ev.invoker.clid;
//         const targetChannels = channelList.filter(channel => channel.name === targetChannelName);
//         const targetChannelId = targetChannels && targetChannels.length > 0 ? targetChannels[0].cid : null;
//         if (targetChannelId !== null) {
//             teamspeak.clientMove(clientId, targetChannelId);
//         }
//     }
//     // console.log(`${ev.invoker.nickname} just send the message "${ev.msg}"`)
// })
