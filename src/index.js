import fs from "fs"
import url from "url"
import glob from "glob"
import {Plugin} from "kb2abot"
import deepExtend from "deep-extend"

export default class Internal extends Plugin {
	package = JSON.parse(
		fs.readFileSync(new URL(url.resolve(import.meta.url, "../package.json")))
	);

	handleDatastore(rawConfig, rawUserdata) {
		const templateConfig = {
			aarInterval: 1000 * 60
		}
		const templateUserdata = {
			autoreply: {engine: "off", list: {}},
			aar: {},
			messages: [],
			rank: {}
		}
		return {
			config: deepExtend(templateConfig, rawConfig),
			userdata: deepExtend(templateUserdata, rawUserdata)
		}
	}

	// Called after this plugin is constructored (you would wrap your "async this.commands.add(command)" in this function in order to load commands in synchronous)
	async load() {
		const files = glob.sync(
			url.fileURLToPath(new URL(url.resolve(import.meta.url, "commands/*.js")))
		)
		const commands = []
		for (const file of files) {
			const Command = (await import(url.pathToFileURL(file))).default
			commands.push(new Command())
		}
		await this.commands.add(...commands)
	}

	// Called when this plugin is disabled
	async onDisable() {}

	// Called when this plugin is enabled
	async onEnable() {}

	async onLogin(api) {
		const connecters = []
		for (const cmd of this.commands)
			if (cmd.onLogin) connecters.push(cmd.onLogin(api))
		await Promise.all(connecters)
	}

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
