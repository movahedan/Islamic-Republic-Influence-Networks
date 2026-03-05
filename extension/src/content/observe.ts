import { findTweetArticles } from "./dom-extractors";

export function observeAndProcess(
	processTweet: (article: HTMLElement) => void,
	processProfilePage?: () => void,
) {
	const seen = new WeakSet<HTMLElement>();

	const scan = (root: ParentNode) => {
		const articles = findTweetArticles(root);
		for (const a of articles) {
			if (seen.has(a)) continue;
			seen.add(a);
			processTweet(a);
		}
		if (processProfilePage) processProfilePage();
	};

	scan(document);

	const mo = new MutationObserver((mutations) => {
		for (const m of mutations) {
			for (const n of m.addedNodes) {
				if (n.nodeType === Node.ELEMENT_NODE) scan(n as Element);
			}
		}
	});

	mo.observe(document.documentElement, { childList: true, subtree: true });
}
