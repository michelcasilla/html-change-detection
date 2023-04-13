import * as path from 'path';
import { HtmlChangeDetector } from './htmlChangeDetector';
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
  const detector = new HtmlChangeDetector(token, slackChannel, base, committedBy, branchUrl);
  const diffFilePath = path.join(__dirname, 'diff.txt');
  await detector.processDiffFile(diffFilePath);

})();

