import fs from "fs"
import url from "url"
import glob from "glob"
import {Plugin} from "kb2abot"

export default class Internal extends Plugin {
	package = JSON.parse(
		fs.readFileSync(new URL(url.resolve(import.meta.url, "../package.json")))
	);

	handleDatastore(rawConfig, rawUserdata) {
		const templateConfig = {
			datastoreInterval: 1000 * 60 * 60 * 1
		}
		const templateUserdata = {
			aar: {},
			messages: [],
			rank: {}
		}
		return {
			config: {...templateConfig, ...rawConfig},
			userdata: {...templateUserdata, ...rawUserdata}
		}
	}

	// Called after this plugin is inited but before it has been enabled (like an async constructor)
	async load() {
		const files = glob.sync(url.fileURLToPath(new URL(url.resolve(import.meta.url, "commands/*.js"))))
		const commands = []
		for (const file of files) {
			const Command = (await import(file)).default
			commands.push(new Command())
		}
		await this.commands.add(...commands)
	}

	// Called when this plugin is disabled
	async onDisable() {}

	// Called when this plugin is enabled
	async onEnable() {}

	async hook(thread, message, reply, api) {
		const hookers = []
		for (const cmd of this.commands)
			if (cmd.hook) hookers.push(cmd.hook(thread, message, reply, api))
		await Promise.all(hookers)
	}
}

export {GameSchema, StateManager, gameManager} from "./commands/game"
export {tiktok} from "./commands/tiktok"
export {unshorten} from "./commands/unshorten"
export {getWeather} from "./commands/weather"