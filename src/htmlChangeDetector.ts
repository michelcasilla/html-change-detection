import * as fs from 'fs';
import * as path from 'path';
import { WebClient } from '@slack/web-api';
import { logWithColor } from './logger';
import { SlackNotification } from './slackNotify';
import { text } from 'stream/consumers';

export class HtmlChangeDetector {
  private webClient: WebClient;
  private pattern = /[-][<]?(?:.*?)(class\s*=\s*".*?"|id\s*=\s*".*?"|[a-zA-Z-]+\s*=\s*".*?")[>]?|[-]\s*<\/\w+>/g;
  private notifier;
  private baseBranch;
  constructor(token: string, slackChannel: string, base?: string) {
    // this.webClient = new WebClient(token);
    this.baseBranch = base;
    this.notifier = new SlackNotification(token, slackChannel);
  }

  private readDiffFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  private detectChanges(diffText: string): string[] | null {
    const matches = diffText.match(this.pattern);
    
    if (!matches) {
      return null;
    }
  
    const uniqueMatches = new Set(matches.map(x => x.replace(/\t/gi, '').trim()));
    const matchedCleanedList = Array.from(uniqueMatches);
  
    return matchedCleanedList;
  }
  

  private createMessage(matches: string[] | null): string {
    if (!matches) {
      return 'No HTML changes detected';
    }

    let message = 'HTML changes detected:\n\r';
    // remove duplicates 
    // remove enter
    // trim side values
    // and join with and enter
    message += matches.join('\n\r');
    return message;
  }

  public async sendMessageToSlack(channel: string, message: string, changes = []): Promise<void> {
    try {
      this.notifier.send({
        text: message,
        branch: this.baseBranch,
        committedBy: 'Michel Casilla',
        avatar: '',
        changes
      })
      // await this.webClient.chat.postMessage({
      //   channel,
      //   text: message,
      // });
    } catch (error) {
      console.error('Error trying to send message to Slack:', error);
    }
  }

  public async processDiffFile(filePath: string, slackChannel: string): Promise<void> {
    const diffText = this.readDiffFile(filePath);
    const matches = this.detectChanges(diffText);
    const message = this.createMessage(matches);
    logWithColor(message, 'green');
    await this.sendMessageToSlack(slackChannel, message, matches);
  }
}