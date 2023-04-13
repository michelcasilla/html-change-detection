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
		const t = params.changes.length;
		const severity = t > 20 ? 'MEDIUM' : t > 500 ? 'HIGHT' : 'LOW';
		return [
			{
				"pretext": `Pull request *${params.branchUrl}* from *https://github.com/${this.username}* may have impact on *Auto_Testing*`,
				"title": `Changes made by *${this.username}* on *${params.branch}* may have ${severity} impact on Auto_Testing`,
				"fields": params.changes.map(change => {
					return {
						"Change": 'Attribute Changed',
						"value": change,
						"short": false,
					};
				}),
				"color": '#00ff00'
			}
		];
	}
}