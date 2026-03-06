import { selectors } from "./selectors";
import type { Mutator, Theme } from "./types";

const THROTTLE_MS = 80;
const ROUTE_CHECK_MS = 200;
export function throttledObserve(
	mutators: readonly Mutator[],
	shouldScan: (node: Node) => boolean,
): void {
	for (const m of mutators) {
		if (m.condition(document.body)) {
			const options = m.getOptions?.(document.body);
			if (options) m.mutate(options, document.body);
		}
	}

	let throttleScheduled = false;
	let pendingRoots: Set<HTMLElement> = new Set();
	const flushPending = () => {
		throttleScheduled = false;
		const roots = pendingRoots;
		pendingRoots = new Set();

		for (const r of roots) {
			for (const m of mutators) {
				if (m.condition(r) && m.getItems) {
					for (const i of m.getItems(r)) {
						const options = m.getOptions?.(i);
						if (options) m.mutate(options, i);
					}
				} else if (m.condition(r)) {
					const options = m.getOptions?.(r);
					if (options) m.mutate(options, r);
				}
			}
		}
	};

	const mutationObserver = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (shouldScan(m.target)) {
				pendingRoots.add(m.target as HTMLElement);
			}
		}

		if (pendingRoots.size === 0) return;
		if (!throttleScheduled) {
			throttleScheduled = true;
			setTimeout(flushPending, THROTTLE_MS);
		}
	});

	mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
}

export function routeChangeObserver(callback: () => void): () => void {
	let lastPathname = location.pathname;

	const check = (): void => {
		const current = location.pathname;
		if (current !== lastPathname) {
			lastPathname = current;
			callback();
		}
	};

	window.addEventListener("popstate", check);
	const intervalId = setInterval(check, ROUTE_CHECK_MS);

	return () => {
		window.removeEventListener("popstate", check);
		clearInterval(intervalId);
	};
}

export function themeObserver(callback: (theme: Theme) => void): () => void {
	const getTheme = (el: Node): Theme => {
		let theme = selectors.Theme(el as HTMLElement);
		if (!theme) theme = "light";
		if (!["light", "dark"].includes(theme)) theme = "light";
		return theme as Theme;
	};

	callback(getTheme(document.documentElement));
	const mutationObserver = new MutationObserver((mutations) => {
		for (const m of mutations) callback(getTheme(m.target));
	});

	mutationObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"],
	});

	return () => {
		mutationObserver.disconnect();
	};
}
