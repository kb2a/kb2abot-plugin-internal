import fetch from "node-fetch"
import uniqid from "uniqid"
import cheerio from "cheerio"
import {Command} from "kb2abot"
import {isUrlValid} from "kb2abot/util/common"

export default class Shorten extends Command {
	keywords = ["shorten"];
	description = "URL Shortener";
	guide = "<url> <alias>";
	permission = {
		"*": "*"
	};

	async load() {
		
	}

	async onCall(thread, message, reply, api) {
		const [input, alias] = message.args
		console.log(input, alias)
		try {
			return await shortenURL(input, alias)
		}
		catch(err) {
			return err.message
		}
	}
}

export async function shortenURL(input, alias = uniqid().slice(0, 5)) {
	if (!input || !isUrlValid(encodeURI(input))) throw new Error("URL invalid")
	if (alias.length < 5) throw new Error("Alias length must be longer or equal to 5")
	const html = await (await fetch(`https://tinyurl.com/create.php?source=indexpage&url=${encodeURIComponent(input)}&alias=${encodeURIComponent(alias)}`)).text()
	console.log(html)
	const $ = cheerio.load(html)
	const res = $("#copy_div").attr("href")
	if (!res)
		throw new Error("Alias unavailable")
	return res
}