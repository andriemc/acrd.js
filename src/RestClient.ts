import { API_URL } from "./constants";
import { InvalidTokenError, MissingTokenError } from "./errors";
import { validateTokenAPI } from "./util";
import axios, { AxiosInstance } from "axios";

export type RestClientOptions = { apiUrl?: string; token: string };

export default class RESTClient implements RestClientOptions {
	apiUrl: string = API_URL;
	http: AxiosInstance;
	token: string;

	constructor(opts: RestClientOptions) {
		Object.assign(this, opts);
		this.http = axios.create({
			baseURL: this.apiUrl,
			headers: { Authorization: `Bearer ${this.token}` },
		});
	}

	static async create(token: string, apiUrl: string = API_URL) {
		if (!token) {
			throw new MissingTokenError();
		}

		if (validateTokenAPI(token, apiUrl)[1]) {
			throw new InvalidTokenError();
		}
		return new RESTClient({ apiUrl, token });
	}
}
