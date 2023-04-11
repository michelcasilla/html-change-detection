import * as path from 'path';
import { HtmlChangeDetector } from './htmlChangeDetector';
import { logWithColor } from './logger';

(async () => {
  const base = process.env.PR_BASE_REF;
  const token = process.env.SLACK_BOT_TOKEN;
  logWithColor(`PR_BASE_REF: ${base}`, 'green');
  logWithColor(`SLACK_BOT_TOKEN: ${token}`, 'green');
  const detector = new HtmlChangeDetector(token!);
  const diffFilePath = path.join(__dirname, 'diff.txt');
  const slackChannel = '#your-slack-channel';
  await detector.processDiffFile(diffFilePath, slackChannel);
})();

