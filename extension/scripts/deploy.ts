import { spawn } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const MANIFEST_NAME = "manifest.json";

interface Manifest {
	readonly name?: string;
	readonly version: string;
}

function run(cmd: string[], cwd: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const [bin, ...args] = cmd;
		const proc = spawn(bin, args, { cwd, stdio: "inherit", shell: false });
		proc.on("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`Command failed (${code}): ${cmd.join(" ")}`));
		});
		proc.on("error", reject);
	});
}

function slugFromName(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

async function loadManifest(distDir: string): Promise<Manifest> {
	const path = join(distDir, MANIFEST_NAME);
	const raw = await readFile(path, "utf8");
	return JSON.parse(raw) as Manifest;
}

async function zipContentsOf(dir: string, outZipPath: string): Promise<void> {
	await run(["sh", "-c", `cd "${dir}" && zip -r -9 "${outZipPath}" . -x "*.zip"`], dir);
}

async function main(): Promise<void> {
	const cwd = process.cwd();
	const distDir = join(cwd, DIST);

	await run(["bun", "run", "build"], cwd);

	const manifest = await loadManifest(distDir);
	const safeName = slugFromName(manifest.name ?? "extension");
	const zipName = `${safeName}-v${manifest.version}.zip`;
	const outPath = join(distDir, zipName);

	await rm(outPath, { force: true });
	await zipContentsOf(distDir, outPath);

	console.log(`\n✅ Packaged: ${outPath}`);
	console.log("Upload this zip to the Chrome Web Store, or keep it for releases.");
}

main().catch((e) => {
	console.error("\n❌", e instanceof Error ? e.message : e);
	process.exit(1);
});
