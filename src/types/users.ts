import Client from "../Client";

export type IUser = {
	_id: string;
	badges: [];
	status: string;
	unlockedThemeIds: [string];
	username: string;
	discriminator: number;
	avatarURL: string;
	createdAt: string;
};

export type IClientUser = IUser & {
	email: string;
	ignored: { channelIds: [string]; guildIds: [string]; userIds: [string] };
};

export default class User implements IUser {
	client: Client;
	_id: string;
	badges;
	status: string;
	unlockedThemeIds: [string];
	username: string;
	discriminator: number;
	avatarURL: string;
	bot: boolean;
	__v: number;
	createdAt: string;

	constructor(client: Client, data: IUser) {
		Object.assign(this, data);
		this.client = client;
	}
}

export class ClientUser extends User implements IClientUser {
	email: string;
	ignored: { channelIds: [string]; guildIds: [string]; userIds: [string] };

	constructor(client: Client, data: IClientUser) {
		super(client, data);
	}
}
