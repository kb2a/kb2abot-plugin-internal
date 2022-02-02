import {Command} from "kb2abot"

export default class Rank extends Command {
	keywords = ["rank"];
	description = "Xếp hạng mọi người";
	guide = "[max=10]";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const rank = this.plugin.userdata.rank
		if (!rank[thread.id]) rank[thread.id] = {}
		const threadRank = rank[thread.id]
		const max = Number(message.args[0]) || 10
		const {participantIDs} = await api.getThreadInfo(message.threadID)
		const sorting = participantIDs.map(id => {
			return {
				threadID: id,
				amount: threadRank[id] || 0
			}
		}).sort((a, b) => b.amount - a.amount)
		const uinfos = await api.getUserInfo(sorting.map(s => s.threadID).slice(0, max))
		let repMsg = `Top ${max} bạn tương tác nhiều nhất: \n`
		for (let i = 0; i < Math.min(max, sorting.length); i++) {
			if (!uinfos[sorting[i].threadID]) continue
			const {name} = uinfos[sorting[i].threadID]
			repMsg += `${i + 1}. (${sorting[i].amount}) ${name}\n`
		}
		return repMsg
	}

	hook(thread, message, reply, api) {
		const rank = this.plugin.userdata.rank
		if (!rank[thread.id]) rank[thread.id] = {}
		const threadRank = rank[thread.id]
		if (!threadRank[message.senderID]) threadRank[message.senderID] = 0
		threadRank[message.senderID]++
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
