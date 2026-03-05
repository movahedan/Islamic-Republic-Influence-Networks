export function findTweetArticles(root: ParentNode): NodeListOf<HTMLElement> {
	return root.querySelectorAll<HTMLElement>('article[role="article"]');
}

export function getPageTheme(): "light" | "dark" {
	const theme = document.documentElement.getAttribute("data-theme");
	if (theme === "light" || theme === "dark") return theme;
	return "dark";
}

export function extractHandle(article: HTMLElement): string | null {
	const links = article.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
	for (const a of links) {
		const href = a.getAttribute("href") ?? "";
		if (/^\/[A-Za-z0-9_]{1,20}$/.test(href)) return href.slice(1).toLowerCase();
	}
	return null;
}

export function findActionBar(article: HTMLElement): HTMLElement | null {
	const reply = article.querySelector<HTMLElement>('[data-testid="reply"]');
	const group = reply?.closest('div[role="group"]');
	return (group as HTMLElement) ?? null;
}

export function findTweetText(article: HTMLElement): HTMLElement | null {
	return article.querySelector<HTMLElement>('div[data-testid="tweetText"]');
}

export function isRetweet(article: HTMLElement): boolean {
	return /Reposted|retweeted/i.test(article.textContent ?? "");
}

export function isProfilePage(): boolean {
	let path = document.location.pathname;
	if (path.endsWith("/")) path = path.slice(0, -1);
	if (!path.startsWith("/") || path.length <= 1) return false;
	const afterFirstSlash = path.slice(1);
	return !afterFirstSlash.includes("/");
}

export function getHandleFromProfileUrl(): string | null {
	const segment = document.location.pathname.split("/").filter(Boolean)[0];
	return segment ?? null;
}

function hrefFirstSegmentMatches(anchor: HTMLAnchorElement, normalized: string): boolean {
	const href = anchor.getAttribute("href") ?? "";
	const segment = href.startsWith("/") ? href.slice(1).split("/")[0]?.toLowerCase() : null;
	return segment === normalized;
}

const PROFILE_HEADER_ANCESTOR_LIMIT = 15;

export function findProfileUserName(handle: string): HTMLElement | null {
	const normalized = handle.toLowerCase();
	const candidates = document.querySelectorAll<HTMLElement>('[data-testid="UserName"]');
	for (const el of candidates) {
		let parent: HTMLElement | null = el.parentElement;
		let depth = 0;
		while (parent && depth < PROFILE_HEADER_ANCESTOR_LIMIT) {
			const links = parent.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
			for (const link of links) {
				if (hrefFirstSegmentMatches(link, normalized)) return el;
			}
			parent = parent.parentElement;
			depth++;
		}
	}
	return null;
}
