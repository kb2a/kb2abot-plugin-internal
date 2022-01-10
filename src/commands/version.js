import {readFileSync} from "fs"
import semver from "semver"
import fetch from "node-fetch"
import {Command} from "kb2abot"

const OUTDATED = -1

export default class Version extends Command {
	keywords = ["version"];
	guide = "[<amount>=5]";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		let amount = 5
		if (message.args[0]) {
			amount = Number(message.args[0])
			if (isNaN(amount))
				throw new Error(`${message.args[0]} is not a valid number!`)
		}
		const versions = []
		const localPackage = JSON.parse(
			readFileSync(process.cwd() + "/package.json")
		)
		const localRelease = await json(
			"https://api.github.com/repos/kb2ateam/kb2abot-bootloader/releases/tags" +
				localPackage.version
		)
		const releases = await json(
			"https://api.github.com/repos/kb2ateam/kb2abot-bootloader/tags"
		)

		if (releases.length > 0) {
			let count = 0
			versions.push(`${localRelease.name} (current)`)
			for (const release of releases) {
				if (release.name == localRelease.name) continue
				const content = `${release.name} - ${release.published_at}`
				semver.compare(localRelease.name, release.name) == OUTDATED
					? versions.unshift(content)
					: versions.push(content)
				if (++count >= amount - 1) break
			}
		} else {
			versions.push("There is no release yet!")
		}
		return versions.join("\n")
	}
}

async function json(url) {
	return await (await fetch(url)).json()
}
