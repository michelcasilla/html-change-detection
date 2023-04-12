import SlackNotify from 'slack-notify';

export class SlackNotification{
	private hook_url: string;
	private channel: string;
	private username: string;
	private slack;
	constructor(hook_url: string, channel: string, username?: string){
		this.hook_url = hook_url;
		this.channel = channel;
		this.username = username;
		this.slack = SlackNotify(this.hook_url);
	}

	async send(params = {text: '', branch: '', committedBy: '', avatar: '', changes: [], channelConf : { unfUrlLinks: 1}}){
		const attachments = [
			{
				"pretext": `PullRequest ${params.branch} from ${params.committedBy} may have impact on Auto_Testing`,
				"title": `${params.committedBy} - ${params.branch}`,
				"fields": params.changes.map(change => {
					return {
						"Change": 'Attribute Changed',
						"value": change,
						"short": true
					}
				}),
				"color": "#00ff00"
			}
		]
		const {text, avatar} = params;
		
		const channel = `#${this.channel}`;
		const username = this.username || 'GitHubAction';
		const unfurl_links = params?.channelConf?.unfUrlLinks || 1;
		return await this.slack.send({ 
			channel, 
			avatar, 
			attachments,
			text, 
			unfurl_links, 
			username 
		});
	}
}