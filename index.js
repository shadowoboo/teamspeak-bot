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
var ts3_nodejs_library_1 = require("ts3-nodejs-library");
var fs = require("fs");
// get teamspeak account
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
    // connect to target server by config
    teamspeak.connect()["catch"](function (err) {
        console.log("----------------------connect error--start------------------");
        console.log(err);
        console.log("----------------------connect error--end------------------");
    });
    // bot init
    teamspeak.on("ready", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // get botInfo
                return [4 /*yield*/, teamspeak.whoami().then(function (res) { return botInfo = res; })];
                case 1:
                    // get botInfo
                    _a.sent();
                    // get channelList
                    return [4 /*yield*/, teamspeak.channelList().then(function (res) { return channelList = res; })];
                case 2:
                    // get channelList
                    _a.sent();
                    // notice chennal that bot login
                    teamspeak.sendTextMessage(botInfo.client_channel_id, ts3_nodejs_library_1.TextMessageTargetMode.CHANNEL, botInfo.client_login_name + " is login now.");
                    // regist events
                    registTeamspeakEvents(teamspeak);
                    return [2 /*return*/];
            }
        });
    }); });
    // bot close
    teamspeak.on("close", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("disconnected, trying to reconnect...");
                    return [4 /*yield*/, teamspeak.reconnect(-1, 1000)];
                case 1:
                    _a.sent();
                    console.log("reconnected!");
                    return [2 /*return*/];
            }
        });
    }); });
    // bot error
    teamspeak.on("error", function (err) {
        //teamspeak had an error
        console.log("----------------------teamspeak error--start------------------");
        console.log(err);
        console.log("----------------------teamspeak error--end------------------");
    });
    // bot recive message then do something
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
        // if (recieveMsg.indexOf('?') === 1) {
        //     teamspeak.sendTextMessage(channelGroupId, targetmode, `0.0?!`)
        // }
        botSayNani(teamspeak, recieveMsg, channelGroupId, targetmode);
        // dnd roll
        botDice(teamspeak, recieveMsg, channelGroupId, targetmode, ev);
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
/**
 * regist the Teamspeak events which want to be callback
 * @param teamspeak Teamspeak Object with your config
 */
function registTeamspeakEvents(teamspeak) {
    return Promise.all([
        teamspeak.registerEvent("server"),
        teamspeak.registerEvent("channel", 0),
        teamspeak.registerEvent("textserver"),
        teamspeak.registerEvent("textchannel"),
        teamspeak.registerEvent("textprivate"),
    ]);
}
/**
 * bot command format sample: !google Something
 * bot command format : 'cmdSymbol''cmd' 'param'
 * @param textMsgObj the response object when teamspeak event "textmessage" effcet
 */
function botOnRecieveMsg(textMsgObj) {
    // set common const
    var recieveMsg = textMsgObj.msg.trim();
    var channelGroupId = textMsgObj.invoker.channelGroupId;
    // set bot config
    var cmdSymbol = '!';
    // guard check
    if (recieveMsg.indexOf(cmdSymbol) !== 0) {
        return;
    } // bot cmd symbol check
    if (channelGroupId === null || channelGroupId === undefined) {
        return;
    } // channel id exist
}
var BotCmd = /** @class */ (function () {
    function BotCmd(teamspeak, cmdSymbol, cmdKeywords, cmdParam, cmdResponse) {
        this.cmdSymbol = '!';
        this.cmdKeywords = [];
        this.cmdParam = [];
        this.cmdResponse = function (recieveMsg) { };
        this.cmdSymbol = cmdSymbol;
        this.cmdKeywords = cmdKeywords;
        this.cmdParam = cmdParam;
        this.cmdResponse = cmdResponse;
        this.teamspeak = teamspeak;
    }
    return BotCmd;
}());
function botSayNani(teamspeak, recieveMsg, channelGroupId, targetmode) {
    // set BotCmd Obj
    var botCmd = new BotCmd(teamspeak, '!', ['?'], [], function (recieveMsg) {
        teamspeak.sendTextMessage(channelGroupId, targetmode, "0.0?!");
    });
    // parse cmd line and parse msg
    var regexpRule = new RegExp("(^" + botCmd.cmdSymbol + ")(\\" + botCmd.cmdKeywords + ")");
    var isEffect = regexpRule.test(recieveMsg);
    var textParse = isEffect ? recieveMsg.match(regexpRule) : null;
    var recieveParam = textParse ? textParse[3] : null;
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
function botDice(teamspeak, recieveMsg, channelGroupId, targetmode, ev) {
    var askerName = ev.invoker.nickname;
    // set BotCmd Obj
    var botCmd = new BotCmd(teamspeak, '!', ['roll'], // TODO: 讓正則表達支援 array 關鍵字判斷, 任一
    [], function (msg) {
        // dnd roll parse rule
        var regexpRule = /(?:\((?<number>\d+)d(?<value>\d+)\)(?:(?<prefix>[\+\-])(?<bonus>\d+))?)/;
        var isEffect = regexpRule.test(recieveMsg);
        var textParse = isEffect ? recieveMsg.match(regexpRule) : null;
        // teamspeak.sendTextMessage(channelGroupId, targetmode, msg)
        // teamspeak.sendTextMessage(channelGroupId, targetmode, textParse[0])
        // teamspeak.sendTextMessage(channelGroupId, targetmode, (msg===textParse[0])?'true':'false')
        // teamspeak.sendTextMessage(channelGroupId, targetmode, JSON.stringify(textParse, null, '  '))
        if (!textParse || msg !== textParse[0] || !textParse.groups) {
            return;
        }
        // dice qty
        var theNumber = Number(textParse.groups.number) || 0;
        // dice range 1~n
        var theValue = Number(textParse.groups.value) || 0;
        // 計算符號
        var thePrefix = textParse.groups.prefix ? textParse.groups.prefix : null;
        // bonus number
        var theBonus = textParse.groups.bonus ? Number(textParse.groups.bonus) : 0;
        // calculate the random result
        var res = dndBasicDice(theNumber, theValue);
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
        var sendMsg = "\n                [size=24][color=blue]" + askerName + "[/color] \u8981\u6C42\u64F2\u9AB0 " + msg + "[/size] : [size=32][color=#fa36cc]" + res.toString() + "[/color][/size]\n            ";
        teamspeak.sendTextMessage(channelGroupId, targetmode, sendMsg);
    });
    // parse cmd line and parse msg
    var regexpRule = new RegExp("(^" + botCmd.cmdSymbol + ")(" + botCmd.cmdKeywords + ") (.*)");
    var isEffect = regexpRule.test(recieveMsg);
    var textParse = isEffect ? recieveMsg.match(regexpRule) : null;
    var recieveParam = textParse ? textParse[3] : null;
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
function dndBasicDice(diceQty, diceRange, beginningNumber) {
    if (beginningNumber === void 0) { beginningNumber = 0; }
    var randomNumber = Math.floor((Math.random() * diceRange) + 1);
    // console.log(randomNumber);
    if (diceQty > 0) {
        return dndBasicDice(diceQty - 1, diceRange, beginningNumber + randomNumber);
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
