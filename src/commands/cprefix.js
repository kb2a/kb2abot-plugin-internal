import {Command} from "kb2abot"

let code = Date.now() % 10000

export default class Cprefix extends Command {
	keywords = ["cprefix"];
	description = "Đổi prefix";
	guide =
		"<prefix>\nHướng dẫn set prefix:\ncprefix <prefix mà bạn muốn đặt> [<code>]\n Cái <code> sẽ rất hữu dụng khi trong group có nhiều bot có cùng prefix!";
	permission = {
		"*": "admin"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const tmp = message.body.split(" ")
		if (tmp.length <= 1) return "Sai cú pháp!"
		if (tmp.length >= 3 && tmp[2] !== code)
			return `Sai code, code prefix hiện tại là: ${code}`
		if (tmp[1].length > 1) return "Prefix không được nhiều hơn 1 kí tự!"
		thread.prefix = tmp[1]
		return `Đã đổi prefix hiện tại của bot thành:\n${thread.prefix}`
	}
}
