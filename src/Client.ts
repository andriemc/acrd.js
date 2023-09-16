import { EventEmitter } from "events";
import RESTClient from "./RestClient";
import { API_URL } from "./constants";
import { InvalidTokenError, MissingTokenError } from "./errors";
import { EventTypes } from "./types/events";
import { createEventHandler, validateTokenAPI } from "./util";
import { Socket, io } from "socket.io-client";
import { ClientUser, IClientUser } from "./types";

export type ClientOptions = {
	apiUrl?: string;
};

export default class Client implements ClientOptions {
	apiUrl: string = API_URL;
	rest: RESTClient;
	ready: Boolean = false;
	sio: Socket;
	token?: string;
	user: ClientUser;
	emitter: EventEmitter;

	constructor(opts: ClientOptions = {}) {
		this.emitter = new EventEmitter();
		Object.assign(this, opts);
	}

	on(eventName: EventTypes, listener: (...args: any[]) => void): this {
		listener = createEventHandler(this, listener);
		this.emitter.on(eventName, listener);
		return this;
	}

	once(eventName: EventTypes, listener: (...args: any[]) => void): this {
		listener = createEventHandler(this, listener);
		this.emitter.once(eventName, listener);
		return this;
	}

	off(eventName: EventTypes, listener: (...args: any[]) => void) {
		listener = createEventHandler(this, listener);
		this.emitter.off(eventName, listener);
		return this;
	}

	async deleteMessage(id: string) {
		return await this.sio.emitWithAck("MESSAGE_DELETE", { messageId: id });
	}

	/** Logs out the client, and exits the client */
	shutdown() {
		this.ready = false;
		this.sio.disconnect();
		delete this.sio;
		delete this.token;
		delete this.rest;
		return this;
	}

	/** Logs in the client to the api */
	async login(token: string) {
		if (!token) {
			throw new MissingTokenError();
		}

		if (validateTokenAPI(token, this.apiUrl)[1]) {
			throw new InvalidTokenError();
		}

		this.token = token;
		this.rest = await RESTClient.create(token, this.apiUrl);
		const skUrl = new URL(this.apiUrl);
		skUrl.pathname = "";
		this.sio = io(skUrl.toString(), {
			secure: true,
			path: "/ws",
			transports: ["polling", "websocket", "flashsocket"],
		});
		this.sio.connect();
		this.on("READY", (data: any[]) => {
			this.ready = true;
			this.user = new ClientUser(this, data as unknown as IClientUser);
		});
		this.sio.emit("READY", { token });
		this.sio.onAny((ev: string, ...args: any) =>
			this.emitter.emit(ev, ...args)
		);

		return this;
	}
}
