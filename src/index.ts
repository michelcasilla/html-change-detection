import * as path from 'path';
import { HtmlChangeDetector } from './htmlChangeDetector';

(async () => {
  const token = process.env.SLACK_BOT_TOKEN;
  const detector = new HtmlChangeDetector(token!);
  const diffFilePath = path.join(__dirname, 'diff.txt');
  const slackChannel = '#your-slack-channel';
  await detector.processDiffFile(diffFilePath, slackChannel);
})();

