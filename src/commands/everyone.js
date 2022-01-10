import {Command} from "kb2abot"

export default class Everyone extends Command {
	keywords = ["everyone", "all"];
	description = "Tag mọi người";
	guide = "<message>";
	permission = {
		"*": "admin"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const text = message.args[0] || ""
		const mentions = []
		let replyMsg = ""
		const {participantIDs} = await api.getThreadInfo(message.threadID)
		participantIDs.splice(
			participantIDs.indexOf(await api.getCurrentUserID()),
			1
		)
		for (const id of participantIDs) {
			const tag = "@"
			replyMsg += tag
			mentions.push({
				tag,
				id: id,
				fromIndex: replyMsg.length - tag.length
			})
		}
		return {
			body: `${replyMsg} ${text}`,
			mentions
		}
	}
}
