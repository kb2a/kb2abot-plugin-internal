import {Command} from "kb2abot"

export default class ReplyReport extends Command {
	keywords = ["rr"];
	description = "Trả lời góp ý";
	guide = "<message>";
	permission = {
		"*": "superAdmin"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const msg = message.args.join(" ")
		if (message.messageReply && msg) {
			const ID = message.messageReply.body.split("\n\n").slice(-1)
			await api.sendMessage(msg, ID)
			return `Đã phản hồi góp ý của ${ID}: ${msg}`
		}
		return "Bạn chưa reply hoặc nội dung tin nhắn rỗng"
	}
}
  