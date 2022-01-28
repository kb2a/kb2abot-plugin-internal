import {Command} from "kb2abot"
// import {shortenUrl} from "./shorten"

export default class AddUser extends Command {
	keywords = ["add"];
	description = "Add user to group";
	guide = "<uid|link|username|full name (mutual)>";
	permission = {
		"*": "*"
	};

	async load() {
		
	}

	async onCall(thread, message, reply, api) {
		const input = message.args.join(" ")
		const uid = await getIdByEverything(api, thread.id, input)
		if (uid === null) {
			// fullname
			const users = (await api.getUserID(input)).filter(u => u.type == "user").slice(0, 3)
			if (users.length == 0 || !users[0].userID)
				throw new Error("We tried our best but failed getting userid")
			const uids = users.map(u => u.userID)
			const info = await api.getUserInfo(uids)
			return uids.map(uid => {
				const inf = info[uid]
				return [
					`Name: ${inf.name}`,
					`Gender: ${inf.gender}`,
					`Mutual to bot: ${inf.isFriend ? "YES": "NO"}`,
					`Profile: ${inf.profileUrl}`,
					`${thread.prefix}${this.keywords[0]} ${uid}`
				].join("\n")
			}).join("\n\n")
		} else {
			await api.addUserToGroup(uid, thread.id)
			return `Successfully added "${uid}"`
		}
	}
}

async function getIdByEverything(api, threadID, input) {
	// numbers
	if (isNumeric(input))
		return Number(input)

	// facebook link
	if (isUrlValid(input))
		try {
			const url = new URL(input)
			url.protocol = "https"
			if (isValidFacebookHost(url.hostname))
				return await getIdByLink(api, url) } catch { throw new Error("Profile url not found or invalid!")
		}

	return null
}

function isUrlValid(userInput) {
	return userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) === null ? false : true
}

function isValidFacebookHost(hostname) {
	return ["www.facebook.com", "facebook.com", "fb.com", "fb.me", "m.me", "m.facebook.com", "mbasic.facebook.com"].includes(hostname)
}

export async function getIdByLink(api, link) {
	const html = await (await api.fetch(link)).text()
	const regex = new RegExp(`lst=${await api.getCurrentUserID()}%3A(.*?)%3A`)
	return regex.exec(html)[1]
}

function isNumeric(str) {
	if (typeof str != "string") return false // we only process strings!  
	return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}