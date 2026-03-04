import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

type XEntry = { username?: string | null };

const ROOT = process.cwd();
const dataDir = join(ROOT, "..", "Data");
const outDir = join(ROOT, "src", "data");
const outFile = join(outDir, "handles.json");

// X/Twitter datasets with username field (IR-X-Network when present)
const files = ["IR-X-Network.json", "MEK.json", "White-Internet.json"];

function norm(handle: string) {
	return handle.trim().replace(/^@/, "").toLowerCase();
}

async function main() {
	const handles = new Set<string>();

	for (const f of files) {
		const path = join(dataDir, f);
		if (!existsSync(path)) {
			console.warn(`Skipping missing file: ${f}`);
			continue;
		}
		const raw = await readFile(path, "utf8");
		const arr = JSON.parse(raw) as XEntry[];
		for (const e of arr) {
			if (e.username) handles.add(norm(e.username));
		}
	}

	await mkdir(outDir, { recursive: true });
	await writeFile(outFile, JSON.stringify([...handles], null, 2), "utf8");

	console.log(`Wrote ${handles.size} handles to ${outFile}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
