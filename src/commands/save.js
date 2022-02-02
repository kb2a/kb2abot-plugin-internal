import {Command} from "kb2abot"
import {success} from "kb2abot/util/logger"

export default class Save extends Command {
	keywords = ["save"];
	description = "Lưu datastore";
	guide = "";
	permission = {
		"*": "admin"
	};

	// Called after this command is inited (like an async constructor)
	async load() {
		
	}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		this.plugin.pluginManager.saveDatastore(this.plugin)
		return "Saved datastore successfully!"
	}
}