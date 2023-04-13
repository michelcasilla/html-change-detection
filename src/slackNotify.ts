import SlackNotify from 'slack-notify';

export class SlackNotification{
	private hook_url: string;
	private channel: string;
	private username: string;
	private slack;
	constructor(hook_url: string, channel: string, username?: string){
		this.hook_url = hook_url;
		this.channel = channel;
		this.username = username || 'GitHubAction';
		this.slack = SlackNotify(this.hook_url);
	}

	async send(params = {text: '', branch: '', branchUrl: '', avatar: '', changes: [], channelConf : { unfUrlLinks: 1}}){
		const attachments = this.getHTMLNotificationAttachments(params)
		const {text, avatar} = params;
		
		const channel = `#${this.channel}`;
		const unfurl_links = params?.channelConf?.unfUrlLinks || 1;
		return await this.slack.send({ 
			channel, 
			avatar, 
			attachments,
			text, 
			unfurl_links, 
			username : this.username 
		});
	}

	private getHTMLNotificationAttachments(params: { text: string; branch: string; branchUrl: string; avatar: string; changes: any[]; channelConf: { unfUrlLinks: number; }; }) {
		return [
			{
				"pretext": `Pull request *[${[params.branch]}](${params.branchUrl})* from *[${this.username}](https://github.com/${this.username})* may have impact on *Auto_Testing*`,
				"title": `Changes made by *${this.username}* on *${params.branch}* to file *filename*`,
				"fields": params.changes.map(change => {
					const color = String(change).charAt(0) === "-" ? '#D22B2B' : '#00ff00';
					return {
						"Change": 'Attribute Changed',
						"value": change,
						"short": false,
						"color": color,
					};
				}),
				"color": '#00ff00',
				"mrkdwn_in": ['title', 'pretext']
			}
		];
	}
}