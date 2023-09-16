import Client from "../Client";

export type EventTypes = "READY" | "MESSAGE_CREATE" | "MESSAGE_DELETE";

export type Event = {
	/** The client that got the event */
	client: Client;
};

export type EventHandler = (event: Event, ...args: any[]) => void;
