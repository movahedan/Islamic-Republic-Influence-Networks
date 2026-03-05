import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		react(),
		viteStaticCopy({
			targets: [{ src: "manifest.json", dest: "." }],
		}),
	],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				content: "src/content/index.ts",
			},
			output: {
				entryFileNames: "content.js",
			},
		},
	},
});
