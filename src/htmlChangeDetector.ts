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
  private branchUrl;
  constructor(token: string, slackChannel: string, base?: string, committedBy?: string, branchUrl?: string) {
    // this.webClient = new WebClient(token);
    this.baseBranch = base;
    this.branchUrl = branchUrl;
    this.notifier = new SlackNotification(token, slackChannel, committedBy);
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
    let message = 'HTML changes detected';
    if (!matches) {
      message = 'No HTML changes detected';
    }
    return message;
  }

  public async sendMessageToSlack(message: string, changes = []): Promise<void> {
    try {
      await this.notifier.send({
        text: message,
        branch: this.baseBranch,
        branchUrl: this.branchUrl,
        avatar: '',
        changes
      });
    } catch (error) {
      console.error('Error trying to send message to Slack:', error);
    }
  }

  public async processDiffFile(filePath: string): Promise<void> {
    const diffText = this.readDiffFile(filePath);
    const matches = this.detectChanges(diffText);
    const message = this.createMessage(matches);
    logWithColor(message, 'green');
    logWithColor(matches.join(' | '), 'green');
    await this.sendMessageToSlack(message, matches);
  }
}