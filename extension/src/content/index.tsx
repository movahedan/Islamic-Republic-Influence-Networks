import { createRoot } from "react-dom/client";
import handles from "../data/handles.json";
import { Badge } from "../ui/Badge";
import { observeAndProcess } from "./observe";

const HANDLE_SET = new Set((handles as string[]).map((h) => h.toLowerCase()));

/** Repo README – responsible use disclaimer. Change to your fork’s URL if needed. */
const REPO_README_URL = "https://github.com/goldenowlosint/Islamic-Republic-Influence-Networks";

/** Read theme from <html data-theme="light"|"dark"> (X/Twitter). */
function getPageTheme(): "light" | "dark" {
	const theme = document.documentElement.getAttribute("data-theme");
	if (theme === "light" || theme === "dark") return theme;
	return "dark";
}

function extractHandleFromTweetArticle(article: HTMLElement): string | null {
	const links = article.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
	for (const a of links) {
		const href = a.getAttribute("href") || "";
		if (/^\/[A-Za-z0-9_]{1,20}$/.test(href)) {
			return href.slice(1).toLowerCase();
		}
	}
	return null;
}

function injectBadge(anchorEl: HTMLElement) {
	if (anchorEl.querySelector(":scope > .ir-badge-host")) return;

	const host = document.createElement("span");
	host.className = "ir-badge-host";
	host.style.marginLeft = "6px";

	const shadow = host.attachShadow({ mode: "open" });

	const style = document.createElement("style");
	style.textContent = ":host { all: initial; }";
	shadow.appendChild(style);

	const mount = document.createElement("span");
	shadow.appendChild(mount);

	const theme = getPageTheme();
	createRoot(mount).render(
		<Badge text="Listed in OSINT dataset" href={REPO_README_URL} theme={theme} />,
	);

	anchorEl.appendChild(host);
}

function processTweet(article: HTMLElement) {
	const handle = extractHandleFromTweetArticle(article);
	if (!handle || !HANDLE_SET.has(handle)) return;

	const header = article.querySelector<HTMLElement>('div[data-testid="User-Name"]');
	if (header) injectBadge(header);
}

observeAndProcess(processTweet);
