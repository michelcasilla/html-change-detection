import * as path from 'path';
import { HtmlChangeDetector } from './htmlChangeDetector';
import { logWithColor } from './logger';
import { validateEnv } from './validate';

(async () => {

  validateEnv([
    'SLACK_CHANNEL',
    'SLACK_BOT_TOKEN'
  ]);

  const base = process.env.PR_BASE_REF;
  const token = process.env.SLACK_BOT_TOKEN;
  const slackChannel = process.env.SLACK_CHANNEL;

  // const atPath = process.env.AUTOMATE_TESTING_REPO_PATH;
  // logWithColor(`PR_BASE_REF: ${base}`, 'green');
  // logWithColor(`SLACK_BOT_TOKEN: ${token}`, 'green');
  const detector = new HtmlChangeDetector(token!);
  const diffFilePath = path.join(__dirname, 'diff.txt');
  await detector.processDiffFile(diffFilePath, slackChannel);

})();

