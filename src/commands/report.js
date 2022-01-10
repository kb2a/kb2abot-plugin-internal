import {Command} from "kb2abot"

const khoakomlem = "100007723935647"

export default class Report extends Command {
	keywords = ["report", "bug"];
	description = "Gửi góp ý hoặc báo lỗi cho nhà phát triển";
	guide = "<message>";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const msg = message.args.join(" ")
		if (msg) {
			await api.sendMessage(`"${msg}"\n\n${message.senderID}`, khoakomlem)
			return `Đã gửi tin nhắn góp ý tới nhà phát triển với nội dung: ${msg}`
		}
		return "Bạn chưa điền góp ý hay báo lỗi trong lệnh!"
	}
}
