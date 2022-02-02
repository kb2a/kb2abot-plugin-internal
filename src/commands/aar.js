import {Command} from "kb2abot"
import {success, error} from "kb2abot/util/logger"
import Thread from "kb2abot/deploy/facebook/models/Thread.js"

export default class AAR extends Command {
	keywords = ["aar"];
	description = "Tự động chấp nhận tin nhắn đang chờ và spam (default: off)";
	guide = "(call to toggle on/off)";
	permission = {
		"*": "admin"
	};

	async load() {
	}

	// Called from this.plugin.onConnect
	onLogin(api) {
		setInterval(async () => {
			if (!this.plugin.userdata.aar.enable) return
			try {
				const list = [
					...(await api.getThreadList(1, null, ['PENDING'])),
					...(await api.getThreadList(1, null, ['OTHER'])),
				]
				if (list[0]) {
					const { isSubscribed, threadID } = list[0]
					const thread = await getThread(threadID)
					if (!isSubscribed || await api.sendMessage('KB2ABOT - CONNECTED', threadID))
						await api.deleteThread(threadID)
					else {
						await api.sendMessage(
							`/help để xem danh sách lệnh!`,
							threadID
						)
						success(`THREAD ${threadID} CONNECTED!`)
						await thread.save()
					}
				}
			}
			catch(err) {
				error("[Auto Accept Request] interval error: ", err)
			}
		}, this.plugin.config.aarInterval)
	}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const aar = this.plugin.userdata.aar
		console.log(aar)
		aar[thread.id] = aar[thread.id] ? !aar[thread.id] : true
		console.log(aar)
		return `Đã ${
			aar[thread.id] ? "BẬT" : "TẮT"
		} tự động chấp nhận tin nhắn đang chờ`
	}
}

async function getThread(threadID) {
	let thread
	try {
		thread = await Thread.findOne({id: threadID})
	} finally {
		if (!thread)
			thread = new Thread({
				id: threadID
			})
	}
	return thread
}
