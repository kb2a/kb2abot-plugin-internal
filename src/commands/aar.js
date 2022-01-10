import {Command} from "kb2abot"

export default class AAR extends Command {
	keywords = ["aar"];
	description = "Tự động chấp nhận tin nhắn đang chờ và spam";
	guide = "";
	permission = {
		"*": "admin"
	};

	// Called after this command is inited (like an async constructor)
	async load() {
		// const Command = (await import("../..")).default
		// await this.childs.add(new Command())
		/*
		setInterval(async () => {
			if (!enable) return
			const list = [
				...(await getThreadList(1, null, ['PENDING'])),
				...(await getThreadList(1, null, ['OTHER'])),
			]
			if (list[0]) {
				const { isSubscribed, threadID } = list[0]
				const err = await sendMessage('KB2ABOT - CONNECTED', threadID)
				if (!isSubscribed || err) await deleteThread(threadID)
				else {
					await sendMessage(
						`${kb2abot.config.DEFAULT_THREAD_PREFIX}help để xem danh sách lệnh!`,
						threadID
					)
					console.newLogger.success(
						'THREAD ' + threadID + ' CONNECTED!'
					)
				}
			}
		}, kb2abot.config.INTERVAL.AUTO_ACCEPT_REQUEST)
		 */
	}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const storage = this.plugin.userdata.aar
		storage[thread.id] = storage[thread.id] ? true : !storage[thread.id]
		return `Đã ${
			storage[thread.id] ? "BẬT" : "TẮT"
		} tự động chấp nhận tin nhắn đang chờ`
	}
}
