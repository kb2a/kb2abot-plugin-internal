import {getVideoMeta} from "tiktok-scraper"
import {Command} from "kb2abot"

export default class Tiktok extends Command {
	keywords = ["tiktok"];
	description = "Lấy link video Tiktok (có watermark)";
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
			return `Link của video này là: ${await tiktok(url)}`
		} catch {
			return "Lỗi phát sinh trong quá trình lấy link"
		}
	}
}

export async function tiktok(url) {
	const videoMeta = await getVideoMeta(url.toString(), {})
	return videoMeta.collector[0].videoUrlNoWaterMark.length
		? videoMeta.collector[0].videoUrlNoWaterMark
		: videoMeta.collector[0].videoUrl
}
