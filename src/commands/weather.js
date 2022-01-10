import fetch from "node-fetch"
import {Command} from "kb2abot"

const WEATHER_KEY = "9e41bc31443314a1c5ad9695f2e9f9d1"

export default class Weather extends Command {
	keywords = ["weather"];
	description = "Xem thời tiết tại 1 khu vực";
	guide = "<location>";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const userdata = this.plugin.userdata
		if (message.args[0] == "set" && message.args.length > 1) {
			const location = message.args.slice(1).join(" ")
			userdata.default_location = location
			return `Đã set địa điểm mặc định là ${userdata.default_location}`
		} else {
			const location = message.args.join(" ") || userdata.default_location
			if (!location)
				return `Vui lòng nhập địa điểm!\nNote: Bạn có thể set địa điểm mặc định bằng lệnh ${thread.prefix}${this.keywords[0]} set <địa điểm>`
			try {
				const {weather, main, name} = await getWeather(location)
				const replyMsg = [
					`Name: ${name}`,
					`Weather: ${weather[0].main}`,
					weather[0].description,
					`Temperature: ${Math.round(main.temp_min - 273)}°C ~ ${Math.round(
						main.temp_max - 273
					)}°C`
				]
				return replyMsg.join("\n")
			} catch {
				return `Không tìm thấy địa điểm nào có tên: ${location}`
			}
		}
	}
}

export async function getWeather(location) {
	return await (
		await fetch(
			`http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
				location
			)}&APPID=${WEATHER_KEY}`
		)
	).json()
}
