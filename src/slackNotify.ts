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

	async send(params = {text: '', branch: '', branchUrl: '', avatar: '', changes: [], channelConf : { unfUrlLinks: 1}, usage: []}){
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

	private getHTMLNotificationAttachments(params: { text: string; branch: string; branchUrl: string; avatar: string; changes: any[]; channelConf: { unfUrlLinks: number; }, usage: any}) {
		const t = params.changes.length;
		const isBeingUsed = (params?.usage || []).length;
		let severity = t > 20 ? 'MEDIUM' : t > 500 ? 'HIGHT' : 'LOW';
		if(isBeingUsed){
			severity = 'HIGHT';
		}
		const attachments = [
			{
				"pretext": `Pull request *${params.branchUrl}* from *https://github.com/${this.username}* may have impact on *Auto_Testing*`,
				"title": `${t} changes detected made by *${this.username}* on *${params.branch}* may have ${severity} impact on Auto_Testing`,
				"fields": (params.changes || []).slice(0,10).map(change => {
					return {
						"Change": 'Attribute Changed',
						"value": change,
						"short": false,
					};
				}),
				"color": '#00ff00'
			}
		];
		if(t > 10){
			attachments[0].fields.push({
				"Change": 'More',
				"value": `...+ ${t-10} changes more`,
				"short": false,
			})
		}
		return attachments;
	}
}