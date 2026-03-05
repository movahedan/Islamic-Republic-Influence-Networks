export const WARNING_HOST_CLASS = "ir-warning-host";
export const RETWEETS_SUMMARY_HOST_CLASS = "ir-retweets-summary-host";

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

const PROFILE_TAB_TEXT = new Set(["posts", "replies", "media"]);
export function isProfilePage(): boolean {
	const tabs = document.querySelectorAll<HTMLAnchorElement>('a[role="tab"]');
	for (const tab of tabs) {
		const tabText = tab.innerText.toLowerCase();
		if (PROFILE_TAB_TEXT.has(tabText)) return true;
	}
	return false;
}

export function getHandleFromProfileUrl(): string | null {
	const segment = document.location.pathname.split("/").filter(Boolean)[0];
	return segment ?? null;
}

export function isRetweetsPage(): boolean {
	const path = document.location.pathname;
	return path.includes("/retweets") && path.includes("/status/");
}

export function findRetweetsPageTabBar(root: ParentNode): HTMLElement | null {
	return root.querySelector<HTMLElement>('[role="navigation"]:has([role="tablist"])');
}

export function findUserCells(root: ParentNode): NodeListOf<HTMLElement> {
	return root.querySelectorAll<HTMLElement>('[data-testid="UserCell"]');
}

export function findFirstUserCell(root: ParentNode): HTMLElement | null {
	return root.querySelector<HTMLElement>('[data-testid="UserCell"]');
}

export function isOurInjectedNode(node: Node): boolean {
	if (node.nodeType !== Node.ELEMENT_NODE) return false;
	const el = node as Element;
	return (
		el.classList?.contains(WARNING_HOST_CLASS) === true ||
		el.classList?.contains(RETWEETS_SUMMARY_HOST_CLASS) === true ||
		el.closest?.(`.${WARNING_HOST_CLASS}`) != null ||
		el.closest?.(`.${RETWEETS_SUMMARY_HOST_CLASS}`) != null
	);
}

export function shouldScanNode(node: Node): boolean {
	if (node.nodeType !== Node.ELEMENT_NODE) return false;
	const el = node as Element;
	if (el.getAttribute?.("role") === "article") return true;
	if (el.getAttribute?.("data-testid") === "UserCell") return true;
	return (
		el.querySelector?.('article[role="article"]') != null ||
		el.querySelector?.('[data-testid="UserCell"]') != null ||
		el.querySelector?.('[data-testid="UserName"]') != null ||
		el === document.documentElement
	);
}

export function extractHandleFromUserCell(cell: HTMLElement): string | null {
	const links = cell.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
	for (const a of links) {
		const href = a.getAttribute("href") ?? "";
		if (/^\/[A-Za-z0-9_]{1,20}$/.test(href)) return href.slice(1).toLowerCase();
	}
	return null;
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
