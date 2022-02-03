import fetch from "node-fetch"
import {error} from "kb2abot/util/logger"
export default async message => {
	const params = new URLSearchParams()
	// Note: This handler code is belong to C3CBOT

	// const lc = (data.resolvedLang || global.config.language).slice(0, 2)
	// switch (lc) {
	// case "vi":
	// 	lc = "vn"
	// 	break
	// }

	params.set("lc", "vn")
	params.set("message_sentence", message.body)

	params.set("uid", "295781205") // user id 🤔
	params.set("av", "6.9.0.6") // simsimi app version
	params.set("cc", "")
	params.set("tz", "Asia/Jakarta")
	params.set("os", "a") //Extracted from Android app lol.
	params.set("ak", "zZfhY/fJo2UpdIuUjTJftPJvTf4=")

	// These 3 settings is used to set whether to filter out bad words. (idk the parameter so i just let the value as it.)
	params.set("normalProb", "2")
	params.set("isFilter", "1")
	params.set("reqFilter", "0")

	params.set("talkCnt", "0") // Talk count? weird.
	params.set("talkCntTotal", "0")

	// I'm afraid that the session key will expire. pls yell at me if the session key expired. Valid as of 30/10/2020 17:57 GMT+7
	params.set(
		"session",
		"Ub9BEwnCb4GB6ZhgCKbfS2HPv2EJCUnMmqEgx41SEdmJZQDmpGcNy8zad29p6QZjGTKoWAjVJfCZz7fuGxquNtQ4"
	)

	params.set("triggerKeywords", "[]")

	const res = await fetch(
		"https://secureapp.simsimi.com/v1/simsimi/talkset" + params.toString(),
		{
			method: "GET",
			headers: {
				"User-Agent": "C3CBot-SimSimi/2.0"
			}
		}
	)

	if (res.status == 524) {
		error("Simsumi hook error: Cloudflare HTTP 524 Timed out")
		return
	} else if (res.status != 200) {
		console.log(await res.text())
		error(`Simsumi hook error: HTTP ${res.status}`)
		return
	} else {
		const res2 = await res.json()
		if (res2.error && res2.error != -1) {
			error(
				"Simsumi hook error: Remote server returned corrupted data. Dumping...\n" +
					JSON.stringify(res2)
			)
			return
		}

		return res2.success
	}
}
