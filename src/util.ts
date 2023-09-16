import axios from "axios";
import { API_URL } from "./constants";
import { EventHandler, Event } from "./types";
import Client from "./Client";

function createEventHandler(
	client: Client,
	listener: (...args: any[]) => void
): EventHandler {
	return (event: Event, ...args: any) => {
		event.client = client;
		if (args.message) {
		}
		listener(event, ...args);
	};
}

async function validateTokenAPI(token: string, apiUrl: string = API_URL) {
	try {
		const tempAxios = axios.create({
			baseURL: apiUrl,
			headers: { Authorization: `Bearer ${token}` },
		});

		const resp = await tempAxios.get("/users/self");
		return [resp, null];
	} catch (e) {
		console.error(e);
		return [null, e];
	}
}

export { validateTokenAPI, createEventHandler };
