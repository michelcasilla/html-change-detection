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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackNotification = void 0;
const slack_notify_1 = __importDefault(require("slack-notify"));
class SlackNotification {
    constructor(hook_url, channel, username) {
        this.hook_url = hook_url;
        this.channel = channel;
        this.username = username || 'GitHubAction';
        this.slack = (0, slack_notify_1.default)(this.hook_url);
    }
    send(params = { text: '', branch: '', branchUrl: '', avatar: '', changes: [], channelConf: { unfUrlLinks: 1 }, usage: [] }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const attachments = this.getHTMLNotificationAttachments(params);
            const { text, avatar } = params;
            const channel = `#${this.channel}`;
            const unfurl_links = ((_a = params === null || params === void 0 ? void 0 : params.channelConf) === null || _a === void 0 ? void 0 : _a.unfUrlLinks) || 1;
            return yield this.slack.send({
                channel,
                avatar,
                attachments,
                text,
                unfurl_links,
                username: this.username
            });
        });
    }
    getHTMLNotificationAttachments(params) {
        const t = params.changes.length;
        const isBeingUsed = ((params === null || params === void 0 ? void 0 : params.usage) || []).length;
        let severity = t > 20 ? 'MEDIUM' : t > 500 ? 'HIGHT' : 'LOW';
        if (isBeingUsed) {
            severity = 'HIGHT';
        }
        const attachments = [
            {
                "pretext": `Pull request *${params.branchUrl}* from *https://github.com/${this.username}* may have impact on *Auto_Testing*`,
                "title": `${t} changes detected made by *${this.username}* on *${params.branch}* may have ${severity} impact on Auto_Testing`,
                "fields": (params.changes || []).slice(0, 10).map(change => {
                    return {
                        "Change": 'Attribute Changed',
                        "value": change,
                        "short": false,
                    };
                }),
                "color": '#00ff00'
            }
        ];
        if (t > 10) {
            attachments[0].fields.push({
                "Change": 'More',
                "value": `...+ ${t - 10} changes more`,
                "short": false,
            });
        }
        return attachments;
    }
}
exports.SlackNotification = SlackNotification;
//# sourceMappingURL=slackNotify.js.map