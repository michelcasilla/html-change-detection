import * as fs from "fs";
import * as path from "path";
import { WebClient } from "@slack/web-api";
import { logWithColor } from "./logger";
import { SlackNotification } from "./slackNotify";
import { text } from "stream/consumers";

export class HtmlChangeDetector {
  private webClient: WebClient;
  private pattern = /[-][<]?(?:.*?)(class\s*=\s*".*?"|id\s*=\s*".*?"|data-[a-zA-Z-]+\s*=\s*".*?"|[a-zA-Z-]+\s*=\s*".*?")[>]?|[-]\s*<\/\w+>/g;
  private notifier;
  private baseBranch;
  private branchUrl;
  constructor(
    token: string,
    slackChannel: string,
    base?: string,
    committedBy?: string,
    branchUrl?: string
  ) {
    // this.webClient = new WebClient(token);
    this.baseBranch = base;
    this.branchUrl = branchUrl;
    this.notifier = new SlackNotification(token, slackChannel, committedBy);
  }

  private readDiffFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  private detectChanges(diffText: string): string[] | null {
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

  private createMessage(matches: string[] | null): string {
    let message = "HTML changes detected";
    if (!matches) {
      message = "";
    }
    return message;
  }

  public async sendMessageToSlack(
    message: string,
    changes = [],
    usage: any[]
  ): Promise<void> {
    try {
      await this.notifier.send({
        text: message,
        branch: this.baseBranch,
        branchUrl: this.branchUrl,
        avatar: "",
        changes,
        usage
      });
    } catch (error) {
      console.error("Error trying to send message to Slack:", error);
    }
  }

  private findMatchingFilesInDirectory(directory: string, searchTerms: string[]) {
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
        } else if (entry.isFile() && path.extname(entry.name) === '.ts') {
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
  

  public async processDiffFile(filePath: string): Promise<void> {
    const diffText = this.readDiffFile(filePath);
    const matches = this.detectChanges(diffText);
    const message = this.createMessage(matches);
    const usage = this.findMatchingFilesInDirectory(process.env.AUTO_TESTING_PATH, matches);
    if(message){
      logWithColor(message, "green");
      logWithColor(matches.join(" | "), "green");
      await this.sendMessageToSlack(message, matches, usage);
    }
  }
}
