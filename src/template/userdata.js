import deepExtend from "deep-extend"

const template = {
	aar: {},
	messages: [],
	rank: {}
}

export default function (old) {
	// Handle old data your way and return new data
	if (!old)
		return template
	return deepExtend(old, template)
}
