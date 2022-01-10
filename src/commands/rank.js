import {Command} from "kb2abot"

export default class Rank extends Command {
	keywords = ["rank"];
	description = "Xếp hạng mọi người";
	guide = "[<max>=10]";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const userdata = this.plugin.userdata
		const max = Number(message.args[0]) || 10
		try {
			const {participantIDs} = await api.getThreadInfo(message.threadID)
			const temp = []
			for (const threadID of participantIDs)
				temp.push({
					threadID,
					amount: userdata.rank[threadID] || 0
				})
			temp.sort((a, b) => b.amount - a.amount)
			const final = []
			for (const tmp of temp) {
				participantIDs.includes(tmp.threadID) && final.push(tmp.threadID)
			}
			const uinfos = await api.getUserInfo(final.slice(0, max))
			let repMsg = `Top ${max} bạn tương tác nhiều nhất: \n`
			for (let i = 0; i < temp.length; i++) {
				if (!uinfos[temp[i].threadID]) continue
				const {name} = uinfos[temp[i].threadID]
				repMsg += `${i + 1}. (${temp[i].amount}) ${name}\n`
			}
			return repMsg
		} catch {
			return "Lỗi phát sinh trong quá trình xếp hạng."
		}
	}
}

// const { getThreadInfo, getUserInfo } = kb2abot.helpers.fca
// const { getParam } = kb2abot.helpers
// module.exports = {
//     keywords: ['rank'],
//     name: '',
//     description: 'Xếp hạng theo độ tương tác trong nhóm',
//     guide: '',
//     childs: [],
//     permission: {
//         '*': '*',
//     },
//     datastoreDesign: {
//         account: {
//             global: {},
//             local: {},
//         },
//         thread: {
//             global: {},
//             local: {
//                 rank: {},
//             },
//         },
//     },
//     async onLoad() {},
//     hookType: 'non-command',
//     async onMessage(message, reply) {
//         const { rank } = this.storage.thread.local
//         rank[message.senderID] = (rank[message.senderID] || 0) + 1
//     },
//     async onCall(message, reply) {

//     },
// }
