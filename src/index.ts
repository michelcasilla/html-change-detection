import * as path from 'path';
import { HtmlChangeDetector } from './htmlChangeDetector';
import { logWithColor } from './logger';
import { validateEnv } from './validate';

(async () => {

  validateEnv([
    'HTML_SLACK_CHANNEL',
    'HTML_SLACK_HOOK_URL',
    'COMMITTER',
    'BRANCH_URL'
  ]);

  const base = process.env.PR_BASE_REF;
  const token = process.env.HTML_SLACK_HOOK_URL;
  const slackChannel = process.env.HTML_SLACK_CHANNEL;
  const committedBy = process.env.COMMITTER;
  const branchUrl = process.env.BRANCH_URL;

  // const atPath = process.env.AUTOMATE_TESTING_REPO_PATH;
  // logWithColor(`PR_BASE_REF: ${base}`, 'green');
  // logWithColor(`SLACK_BOT_TOKEN: ${token}`, 'green');
  const detector = new HtmlChangeDetector(token, slackChannel, base, committedBy, branchUrl);
  const diffFilePath = path.join(__dirname, 'diff.txt');
  await detector.processDiffFile(diffFilePath);

})();

