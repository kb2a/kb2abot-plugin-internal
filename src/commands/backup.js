import {Command} from "kb2abot"

export default class Backup extends Command {
	keywords = ["backup"];
	description = "Lưu trữ tin nhắn";
	guide = "";
	permission = {
		"*": "admin"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		return `Tổng số tin nhắn đã lưu trữ: ${this.plugin.userdata.messages.length}`
	}
}
