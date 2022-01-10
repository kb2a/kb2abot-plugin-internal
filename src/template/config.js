import deepExtend from "deep-extend"

const template = {}

export default function (old) {
	// Handle old data your way and return new data
	if (!old)
		return template
	return deepExtend(old, template)
}
