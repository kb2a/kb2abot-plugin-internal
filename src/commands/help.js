import stringSimilarity from "string-similarity"
import {Command} from "kb2abot"

export default class Help extends Command {
	keywords = ["help"];
	description = "Hiển thị hướng dẫn hoặc xem danh sách câu lệnh";
	guide = "[command]";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const prefix = thread.prefix
		const pluginManager = this.plugin.pluginManager

		if (pluginManager.length == 0) return "Chưa có plugin nào được load!"

		if (message.args[0]) {
			const keyword = message.args[0]
			const address = keyword.split(".")
			const commands = pluginManager
				.map(plugin => plugin.commands.recursiveFind(address))
				.flat()
			if (commands.length == 1) return genHelp(prefix, commands[0])
			if (commands.length > 1) {
				const header = `Có ${commands.length} lệnh: ${commands
					.map(command => command.address.join("."))
					.join(", ")}\n`
				return (
					header +
					commands.map(cmd => genHelp(prefix, cmd)).join("\n=========\n")
				)
			}
			if (commands.length == 0) {
				const allKeywords = []
				for (const plugin of pluginManager)
					plugin.commands.forEach(command => {
						allKeywords.push(...command.keywords)
					})
				if (allKeywords.length == 0) return "Chưa có lệnh nào đc load!"
				const {ratings} = stringSimilarity.findBestMatch(
					address[address.length - 1],
					allKeywords
				)
				ratings.sort((a, b) => a.rating - b.rating)
				const bestMatches = ratings.slice(-3).map(item => item.target)
				return `Không tìm thấy lệnh: "${
					message.args[0]
				}"\nGợi ý lệnh: ${bestMatches.join(
					", "
				)}\nVui lòng xem danh sách lệnh ở ${thread.prefix}help`
			}
		} else {
			const amount = pluginManager
				.map(plg => plg.commands.childLength)
				.reduce((prev, cur) => prev + cur)
			const replyMsg = []
			for (const plugin of pluginManager) {
				const keywords = plugin.commands.map(command => command.keywords[0])
				if (plugin.isInternal)
					replyMsg.unshift(`🔳 𝐈𝐍𝐓𝐄𝐑𝐍𝐀𝐋: ${keywords.join(", ")}`)
				else replyMsg.push(`▫️ ${plugin.package.name}: ${keywords.join(", ")}`)
			}
			replyMsg.unshift(`[🔎] Có tổng ${amount} câu lệnh!\n`)
			replyMsg.push(
				`\n[❕] ${prefix}help <tên câu lệnh> để xem chi tiết và hướng dẫn sử dụng lệnh`
			)
			// replyMsg += 'Lưu ý: Trong vài hướng dẫn có ghi các kí tự < > [ ] khi xài lệnh không cần ghi vào và "[]" là không bắt buộc';
			return replyMsg.join("\n")
		}
	}
}

export function genHelp(prefix, command) {
	const otherKeywords = command.keywords.filter(c => c != command.keywords[0])
	const otherKeyword =
		otherKeywords.length > 0 ? `(${otherKeywords.join(" ")})` : ""
	return [
		`Lệnh: ${prefix}${command.keywords[0]} ${otherKeyword}`,
		`Địa chỉ: ${command.address}`,
		`Mô tả: ${command.description}`,
		"-----",
		"Hướng dẫn:",
		`${prefix}${command.keywords[0]} ${command.guide}`
	].join("\n")
}
