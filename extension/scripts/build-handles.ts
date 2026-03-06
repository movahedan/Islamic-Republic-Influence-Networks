import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

type XEntry = { username?: string | null };

const ROOT = process.cwd();
const dataDir = join(ROOT, "..", "Data");
const outDir = join(ROOT, "src", "data");
const outFile = join(outDir, "handles.json");

const files = ["IR-X-Network.json", "MEK.json"];

const categoryLabels: Record<string, string> = {
	"ir-x-network": "Flagged",
	mek: "Mojahedin",
};

function norm(handle: string) {
	return handle.trim().replace(/^@/, "").toLowerCase();
}

function fileToCategoryId(filename: string): string {
	return filename
		.replace(/\.json$/i, "")
		.toLowerCase()
		.replace(/_/g, "-");
}

async function main() {
	const handlesByCategory: Record<string, Set<string>> = {};

	for (const f of files) {
		const path = join(dataDir, f);
		if (!existsSync(path)) {
			console.warn(`Skipping missing file: ${f}`);
			continue;
		}
		const categoryId = fileToCategoryId(f);
		if (!handlesByCategory[categoryId]) handlesByCategory[categoryId] = new Set<string>();

		const raw = await readFile(path, "utf8");
		const arr = JSON.parse(raw) as XEntry[];
		for (const e of arr) {
			if (e.username) handlesByCategory[categoryId].add(norm(e.username));
		}
	}

	const output = {
		handlesByCategory: Object.fromEntries(
			Object.entries(handlesByCategory).map(([id, set]) => [id, [...set]]),
		),
		categoryLabels,
	};

	await mkdir(outDir, { recursive: true });
	await writeFile(outFile, JSON.stringify(output, null, 2), "utf8");

	const total = Object.values(handlesByCategory).reduce((s, set) => s + set.size, 0);
	console.log(
		`Wrote ${total} handle entries across ${Object.keys(handlesByCategory).length} categories to ${outFile}`,
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
