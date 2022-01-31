import si from "systeminformation"
import {Command} from "kb2abot"
import {convert_to_string_time} from "kb2abot/util/common"

export default class Sysinfo extends Command {
	keywords = ["sysinfo", "si", "neofetch"];
	description = "Print \"server\" or \"client\" system infomation, default: server";
	guide = "[device=server|client]";
	permission = {
		"*": "*"
	};

	async load() {
		this.data = await si.getStaticData()
		// console.log(this.data.memLayout)
	}

	async onCall(thread, message, reply, api) {
		if (message.args.length == 0)
			message.args.push("server")
		if (!["server", "client"].includes(message.args[0])) {
			return "Must be specific \"server\" or \"client\" 's sysinfo"
		}
		const isServer = message.args[0] == "server"
		const {system, os, cpu, graphics} = isServer ? this.data : await api.socket.emitPromise("sysinfo.static")
		const {uptime} =  isServer ? await si.time() : await api.socket.emitPromise("sysinfo.time")
		const memory = isServer ? await si.mem() : await api.socket.emitPromise("sysinfo.mem")
		const botMemoryUsage = isServer ? process.memoryUsage() : await api.socket.emitPromise("memoryUsage")
		const percent = memory.active / memory.total * 100
		return [
			`${isServer ? "SERVER" : "CLIENT"} SYSTEM INFO:`,
			`OS: ${os.distro} ${os.release} ${os.arch}`,
			`Host: ${system.model}`,
			`Kernel: ${os.kernel}`,
			`Uptime: ${convert_to_string_time(uptime*1000)}`,
			`CPU: ${cpu.manufacturer} ${cpu.brand} (${cpu.cores} cores) ${cpu.speedMin}-${cpu.speedMax}Ghz`,
			`${graphics.controllers.map((g, index) => `GPU ${index+1}: ${g.vendor} ${g.model}`).join("\n")}`,
			`Usage:  ${Math.floor(botMemoryUsage.heapTotal/1024/1024)}MB / ${Math.ceil(memory.total/1024/1024)}MB (${Math.floor(percent)}%)`
		].join("\n")
	}
}
