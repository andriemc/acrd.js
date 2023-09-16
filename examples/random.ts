import { configDotenv } from "dotenv";
configDotenv();

import { Client, IMessage } from "../src";
import Message from "../src/types/messages";

const bot = new Client();

bot.on("READY", () => {
	console.log("Bot is online!");
});

bot.on("MESSAGE_CREATE", async (e: { client: Client; message: IMessage }) => {
	const client = e.client as Client;
	const msg = new Message(client, e.message);
	await msg.delete();
});

bot.login(process.env.TOKEN as string);
