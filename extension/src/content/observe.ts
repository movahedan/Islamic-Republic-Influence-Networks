export function observeAndProcess(processTweet: (article: HTMLElement) => void) {
	const seen = new WeakSet<HTMLElement>();

	const scan = (root: ParentNode) => {
		const articles = root.querySelectorAll<HTMLElement>('article[role="article"]');
		for (const a of articles) {
			if (seen.has(a)) continue;
			seen.add(a);
			processTweet(a);
		}
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
