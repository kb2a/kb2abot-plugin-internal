import axios from "axios"
import cheerio from "cheerio"
import {Command} from "kb2abot"

export default class Unshorten extends Command {
	keywords = ["unshorten"];
	description = "Xem URL rút gọn (bitly, tinyurl,...)";
	guide = "<url>";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const url = message.args[0]
		if (!url) return "Chưa nhập URL"
		try {
			return `URL gốc là: ${await unshorten(url)}`
		} catch {
			return "Lỗi phát sinh trong quá trình khôi phục"
		}
	}
}

export async function unshorten(url) {
	const page = await axios({
			url: "https://unshorten.it/",
			withCredentials: true
		}),
		token = cheerio.load(page.data)("input[name='csrfmiddlewaretoken']")[0]
			.attribs.value,
		cookies = page.headers["set-cookie"].map(x => x.split(";")[0]).join(";"),
		longUrl = await axios({
			url: "https://unshorten.it/main/get_long_url",
			method: "POST",
			headers: {
				"accept-encoding": "application/json",
				cookie: cookies,
				referer: "https://unshorten.it/"
			},
			data:
				"short-url=" + encodeURIComponent(url) + "&csrfmiddlewaretoken=" + token
		})
	return longUrl.data["long_url"]
}
