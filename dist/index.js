"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const htmlChangeDetector_1 = require("./htmlChangeDetector");
const validate_1 = require("./validate");
(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validateEnv)([
        'SLACK_CHANNEL',
        'SLACK_BOT_TOKEN'
    ]);
    const base = process.env.PR_BASE_REF;
    const token = process.env.SLACK_BOT_TOKEN;
    const slackChannel = process.env.SLACK_CHANNEL;
    // const atPath = process.env.AUTOMATE_TESTING_REPO_PATH;
    // logWithColor(`PR_BASE_REF: ${base}`, 'green');
    // logWithColor(`SLACK_BOT_TOKEN: ${token}`, 'green');
    const detector = new htmlChangeDetector_1.HtmlChangeDetector(token, slackChannel);
    const diffFilePath = path.join(__dirname, 'diff.txt');
    yield detector.processDiffFile(diffFilePath, slackChannel);
}))();
//# sourceMappingURL=index.js.map