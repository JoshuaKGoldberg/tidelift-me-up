export function parseOwnership(raw: string[]) {
	return raw
		.flatMap((raw) => raw.split(","))
		.map((ownership) => ownership.trim());
}
