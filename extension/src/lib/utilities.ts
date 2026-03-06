const PROFILE_PAGE_TABS = ["posts", "replies", "media"];

export const utilities = {
	isProfilePage: (): boolean => {
		const tabs = document.querySelectorAll<HTMLAnchorElement>('a[role="tab"]');
		for (const tab of tabs) {
			const tabText = tab.innerText.toLowerCase();
			if (PROFILE_PAGE_TABS.includes(tabText)) return true;
		}
		return false;
	},
	isRetweetsPage: (): boolean => {
		return (
			document.location.pathname.includes("/retweets") &&
			document.location.pathname.includes("/status/")
		);
	},
	getHandleFromUrl: (url = document.location.pathname): string | null => {
		const match = url.match(/^\/[A-Za-z0-9_]{1,20}$/);
		return match ? match[0].slice(1).toLowerCase() : null;
	},
	getHandleFromElement: (el: HTMLElement) => {
		const links = el.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
		for (const a of links) {
			const href = a.getAttribute("href") ?? "";
			if (utilities.getHandleFromUrl(href)) return href.slice(1).toLowerCase();
		}
		return null;
	},
};
