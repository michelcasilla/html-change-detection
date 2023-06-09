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
exports.HtmlChangeDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const logger_1 = require("./logger");
const slackNotify_1 = require("./slackNotify");
class HtmlChangeDetector {
    constructor(token, slackChannel, base, committedBy, branchUrl) {
        this.pattern = /[-][<]?(?:.*?)(class\s*=\s*".*?"|id\s*=\s*".*?"|data-[a-zA-Z-]+\s*=\s*".*?"|[a-zA-Z-]+\s*=\s*".*?")[>]?|[-]\s*<\/\w+>/g;
        // this.webClient = new WebClient(token);
        this.baseBranch = base;
        this.branchUrl = branchUrl;
        this.notifier = new slackNotify_1.SlackNotification(token, slackChannel, committedBy);
    }
    readDiffFile(filePath) {
        return fs.readFileSync(filePath, "utf-8");
    }
    detectChanges(diffText) {
        const excludedList = [
            "ngComponentOutlet",
            "ngIf",
            "ngFor",
            "ngSwitch",
            "ngClass",
            "ngStyle",
            "ngModel",
            "ngModelGroup",
            "ngForm",
            "ngControl",
            "ngControlStatus",
            "ngSubmit",
            "ngSelect",
            "ngPlural",
            "ngPluralCase",
        ];
        const matches = diffText.match(this.pattern);
        if (!matches) {
            return null;
        }
        const matchedCleanedList = matches.filter((match) => {
            return !excludedList.some((excludedItem) => match.includes(excludedItem));
        });
        return matchedCleanedList;
    }
    createMessage(matches) {
        let message = "HTML changes detected";
        if (!matches) {
            message = "";
        }
        return message;
    }
    sendMessageToSlack(message, changes = [], usage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.notifier.send({
                    text: message,
                    branch: this.baseBranch,
                    branchUrl: this.branchUrl,
                    avatar: "",
                    changes,
                    usage
                });
            }
            catch (error) {
                console.error("Error trying to send message to Slack:", error);
            }
        });
    }
    findMatchingFilesInDirectory(directory, searchTerms) {
        const foundMatches = [];
        function searchFilesRecursively(currentPath) {
            if (!fs.existsSync(currentPath)) {
                console.error(`Directory not found: ${currentPath}`);
                return;
            }
            const entries = fs.readdirSync(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                if (entry.isDirectory()) {
                    searchFilesRecursively(fullPath);
                }
                else if (entry.isFile() && path.extname(entry.name) === '.ts') {
                    const fileContent = fs.readFileSync(fullPath, 'utf-8');
                    for (const searchTerm of searchTerms) {
                        if (fileContent.includes(searchTerm)) {
                            foundMatches.push({ file: fullPath, match: searchTerm });
                        }
                    }
                }
            }
        }
        searchFilesRecursively(directory);
        return foundMatches;
    }
    processDiffFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const diffText = this.readDiffFile(filePath);
            const matches = this.detectChanges(diffText);
            const message = this.createMessage(matches);
            const usage = this.findMatchingFilesInDirectory(process.env.AUTO_TESTING_PATH, matches);
            if (message) {
                (0, logger_1.logWithColor)(message, "green");
                (0, logger_1.logWithColor)(matches.join(" | "), "green");
                yield this.sendMessageToSlack(message, matches, usage);
            }
        });
    }
}
exports.HtmlChangeDetector = HtmlChangeDetector;
//# sourceMappingURL=htmlChangeDetector.js.map