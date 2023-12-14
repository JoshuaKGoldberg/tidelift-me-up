export function parseOwnership(raw: string[] | undefined) {
	return raw
		?.flatMap((raw) => raw.split(","))
		.map((ownership) => ownership.trim());
}
