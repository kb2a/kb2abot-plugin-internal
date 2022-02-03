import fetch from "node-fetch"
export default async message => {
	const res = await (
		await fetch(
			`https://api.simsimi.net/v2/?text=${encodeURIComponent(
				message.body
			)}&lc=vi`
		)
	).json()
	return res.success
}
