const THROTTLE_MS = 80;

import {
	processProfilePage,
	processTweet,
	processUserCell,
	refreshRetweetsSummary,
} from "./processors";
import {
	findTweetArticles,
	findUserCells,
	isOurInjectedNode,
	isProfilePage,
	isRetweetsPage,
	shouldScanNode,
} from "./selectors";

function throttledObserve(): void {
	const seen = new WeakSet<HTMLElement>();
	let throttleScheduled = false;
	let pendingRoots: Set<ParentNode> = new Set();

	const scan = (root: ParentNode) => {
		if (isProfilePage()) processProfilePage();

		const userCells = findUserCells(root);
		for (const cell of userCells) {
			if (seen.has(cell)) continue;
			seen.add(cell) && processUserCell(cell);
		}

		const articles = findTweetArticles(root);
		for (const a of articles) {
			if (seen.has(a)) continue;
			seen.add(a) && processTweet(a);
		}

		if (isRetweetsPage()) refreshRetweetsSummary();
	};

	const flushPending = () => {
		throttleScheduled = false;
		const roots = pendingRoots;
		pendingRoots = new Set();
		for (const root of roots) scan(root);
	};

	scan(document);

	const mo = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (m.target.nodeType !== Node.ELEMENT_NODE) continue;
			if (isOurInjectedNode(m.target)) continue;
			if (!shouldScanNode(m.target)) continue;
			pendingRoots.add(m.target as ParentNode);
		}
		if (pendingRoots.size === 0) return;
		if (!throttleScheduled) {
			throttleScheduled = true;
			setTimeout(flushPending, THROTTLE_MS);
		}
	});

	mo.observe(document.documentElement, { childList: true, subtree: true });
}

throttledObserve();
