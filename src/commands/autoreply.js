import {Command} from "kb2abot"
import * as BotEngine from "./botengines"

export default class Autoreply extends Command {
	keywords = ["autoreply", "auto"];
	description = "Tự động trả lời tin nhắn";
	guide =
		"<engine>\nHiện tại gồm các engine: Simsimi, Simsumi.\nĐể tắt bot thì dùng engine: off (/auto off)";
	permission = {
		"*": "*"
	};

	async load() {}

	async onCall(thread, message, reply, api) {
		console.log("Tất cả API Simsimi đang bảo trì :D")
		const autoreply = this.plugin.userdata.autoreply
		const name = message.args[0] || "Simsimi"
		if (name !== "off") {
			for (const botEngine in BotEngine) {
				if (name.toLowerCase() === botEngine.toLowerCase()) {
					autoreply.engine = botEngine
					return `Đã bật engine ${autoreply.engine}!`
				}
			}
			return `Không tìm thấy engine nào có tên: ${name}`
		} else {
			if (autoreply.engine !== "off") {
				autoreply.engine = "off"
				return `Đã tắt engine ${autoreply.engine}!`
			}
		}
	}

	async hook(thread, message, reply, api) {
		const autoreply = this.plugin.userdata.autoreply
		console.log(autoreply)
		if (autoreply.engine !== "off") {
			const msg = await BotEngine[autoreply.engine](message)
			autoreply.list[message.body] = msg
			return msg
		}
	}
}
