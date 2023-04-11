import * as fs from 'fs';
import * as path from 'path';
import { WebClient } from '@slack/web-api';
import { logWithColor } from './logger';

export class HtmlChangeDetector {
  private webClient: WebClient;
  private pattern = /[-][<]?(?:.*?)(class\s*=\s*".*?"|id\s*=\s*".*?"|[a-zA-Z-]+\s*=\s*".*?")[>]?|[-]\s*<\/\w+>/g;

  constructor(token: string) {
    this.webClient = new WebClient(token);
  }

  private readDiffFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  private detectChanges(diffText: string): string[] | null {
    return diffText.match(this.pattern);
  }

  private createMessage(matches: string[] | null): string {
    if (!matches) {
      return 'No HTML changes detected';
    }

    let message = 'HTML changes detected:\n';
    message += matches.join('\n');
    return message;
  }

  public async sendMessageToSlack(channel: string, message: string): Promise<void> {
    try {
      await this.webClient.chat.postMessage({
        channel,
        text: message,
      });
      console.log('Message sent to Slack');
    } catch (error) {
      console.error('Error trying to send message to Slack:', error);
    }
  }

  public async processDiffFile(filePath: string, slackChannel: string): Promise<void> {
    const diffText = this.readDiffFile(filePath);
    logWithColor(diffText, 'green');
    const matches = this.detectChanges(diffText);
    logWithColor(matches, 'green');
    const message = this.createMessage(matches);
    logWithColor(message, 'green');
    await this.sendMessageToSlack(slackChannel, message);
  }
}