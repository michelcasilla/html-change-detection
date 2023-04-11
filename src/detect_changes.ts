import * as fs from 'fs';
import * as path from 'path';
import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_BOT_TOKEN;
const webClient = new WebClient(token);

const diffText = fs.readFileSync(path.join(__dirname, 'diff.txt'), 'utf-8');

const pattern = /[-][<]?(?:.*?)(class\s*=\s*".*?"|id\s*=\s*".*?"|[a-zA-Z-]+\s*=\s*".*?")[>]?|[-]\s*<\/\w+>/g;

const matches = diffText.match(pattern);

(async () => {
  let message = 'No se encontraron cambios en tags, atributos, clases o IDs de HTML.';

  if (matches) {
    message = 'Cambios detectados en HTML:\n';
    message += matches.join('\n');
  }

  try {
    await webClient.chat.postMessage({
      channel: '#your-slack-channel', // Reemplaza esto con el nombre de tu canal de Slack
      text: message
    });
    console.log('Mensaje enviado a Slack.');
  } catch (error) {
    console.error('Error al enviar mensaje a Slack:', error);
  }
})();
