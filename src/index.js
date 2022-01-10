import {readFileSync} from "fs"
import {resolve} from "url"

import {Plugin} from "kb2abot"
import * as Command from "./commands"
import configTemplate from "./template/config"
import userdataTemplate from "./template/userdata"

export default class Internal extends Plugin {
	package = JSON.parse(
		readFileSync(new URL(resolve(import.meta.url, "../package.json")))
	);
	configTemplate = configTemplate;
	userdataTemplate = userdataTemplate;

	// Called after this plugin is inited but before it has been enabled (like an async constructor)
	async load() {
		const commands = []
		for (const key in Command) commands.push(new Command[key]())
		await this.commands.add(...commands)
	}

	// Called when this plugin is disabled
	async onDisable() {}

	// Called when this plugin is enabled
	async onEnable() {}
}

export {GameSchema, StateManager, gameManager} from "./commands/game"
export {tiktok} from "./commands/tiktok"
export {unshorten} from "./commands/unshorten"
export {getWeather} from "./commands/weather"