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
    send(params = { text: '', branch: '', branchUrl: '', avatar: '', changes: [], channelConf: { unfUrlLinks: 1 } }) {
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
        return [
            {
                "pretext": `Pull request *[${[params.branch]}](${params.branchUrl})* from *[${this.username}](https://github.com/${this.username})* may have impact on *Auto_Testing*`,
                "title": `Changes made by *${this.username}* on *${params.branch}* to file *filename*`,
                "fields": params.changes.map(change => {
                    const color = String(change).charAt(0) === "-" ? '#D22B2B' : '#00ff00';
                    return {
                        "Change": 'Attribute Changed',
                        "value": change,
                        "short": false,
                        "color": color,
                    };
                }),
                "color": '#00ff00',
                "mrkdwn_in": ['title', 'pretext']
            }
        ];
    }
}
exports.SlackNotification = SlackNotification;
//# sourceMappingURL=slackNotify.js.map