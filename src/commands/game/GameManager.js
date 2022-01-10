import Manager from "kb2abot/util/Manager"

export default class GameManager extends Manager {
	constructor(games = {}) {
		super()
		this.games = games
	}

	register(games, plugin) {
		for (const key in games) {
			if (!this.games[key])
				this.games[key] = {}
			this.games[key].classDef = games[key]
			this.games[key].plugin = plugin
		}
	}

	run(gameKey, gameOptions) {
		for (const item of this) {
			if (item.threadID === gameOptions.threadID)
				throw new Error(
					`Blocked! Box đang chạy trò chơi: ${item.name}!`
				)
			if (item.participants.includes(gameOptions.masterID))
				throw new Error(
					`Blocked! Bạn đang chơi trò chơi: ${item.name}!`
				)
		}
		this.push(new this.games[gameKey].classDef({
			...gameOptions,
			plugin: this.games[gameKey].plugin
		}))
	}

	async clean(threadID) {
		const item = this.find({ threadID })
		if (item) {
			try {
				await item.clean()
			} finally {
				this.delete({ threadID })
			}
		}
	}

	hasGame(gameKey) {
		// check if the game exists
		const game = this.games[gameKey]
		return game ? true : false
	}

	getList() {
		const list = []
		for (const name in this.games) list.push(name)
		return list
	}
}