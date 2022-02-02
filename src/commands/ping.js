import {Command} from "kb2abot"
import {asyncWait} from "kb2abot/util/common"

export default class Ping extends Command {
	keywords = ["ping"];
	description = "Đỗ trễ của bot và server plugin";
	guide = "[packets=5]";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const packets = Number(message.args[0]) || 5
		if (packets < 1 || packets > 100) return "Số packets ko hợp lệ"
		const arr = []
		for (let i = 0; i < packets; i++) {
			const latency = Math.max(Date.now() - (await api.socket.emitPromise("ping", Date.now())), 0)
			console.log(latency)
			arr.push(latency)
			await asyncWait(100)
		}
		arr.sort((a, b) => a - b)
		const avg = arr.reduce((prev, cur) => prev + cur) / arr.length

		return [
			`Số packet(s): ${packets}`,
			`Ping cao nhất: ${arr[arr.length - 1]}ms`,
			`Ping thấp nhất: ${arr[0]}ms`,
			`Ping trung bình: ${avg.toFixed(2)}ms`
		].join("\n")
	}
}
