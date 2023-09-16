import Client from "../Client";

export type IMessage = {
	attachmentURLs: [string];
	_id: string;
	authorId: string;
	channelId: string;
	content: string;
	__v: 0;
	createdAt: string;
};

export default class Message implements IMessage {
	client: Client;

	constructor(client: Client, data: IMessage) {
		this.client = client;
		Object.assign(this, data);
	}

	/** Deletes the message (If you have permissions.) */
	async delete() {
		this.client.deleteMessage(this._id);
	}

	attachmentURLs: [string];
	_id: string;
	authorId: string;
	channelId: string;
	content: string;
	__v: 0;
	createdAt: string;
}
