import { getCategoryLabel } from "./categories";
import { mountHost, mountSummaryHost, type SummaryLine } from "./mounters";
import {
	extractHandle,
	extractHandleFromUserCell,
	findActionBar,
	findFirstUserCell,
	findProfileUserName,
	findRetweetsPageTabBar,
	findTweetText,
	getHandleFromProfileUrl,
	getPageTheme,
	isProfilePage,
	isRetweet,
	isRetweetsPage,
} from "./selectors";

type WarningMessageProps = {
	isRetweet?: boolean;
	isProfilePage?: boolean;
};

let retweetPathname = "";
const retweetCountByLabel = new Map<string, number>();
const retweetSeenHandles = new Set<string>();
let retweetSummaryHost: HTMLDivElement | null = null;
let retweetSummaryUpdate: ((lines: readonly SummaryLine[]) => void) | null = null;

function buildWarningMessage(categoryLabel: string, props?: WarningMessageProps): string {
	return (props?.isProfilePage ?? false)
		? `Warning: This profile is a ${categoryLabel} account`
		: (props?.isRetweet ?? false)
			? `Warning: This tweet has been retweeted by a ${categoryLabel} account`
			: `Warning: This tweet has been sent from a ${categoryLabel} account`;
}

export function processTweet(article: HTMLElement): void {
	const theme = getPageTheme();
	const handle = extractHandle(article);
	const categoryLabel = handle ? getCategoryLabel(handle) : null;
	if (!categoryLabel) return;

	const message = buildWarningMessage(categoryLabel, { isRetweet: isRetweet(article) });

	const host = mountHost(article, message, theme);
	if (!host) return;

	const actionBar = findActionBar(article);
	const tweetText = findTweetText(article);

	article?.parentElement?.insertBefore(host, article);
	if (actionBar?.parentElement) {
		actionBar?.parentElement?.insertBefore(host, actionBar);
	} else if (tweetText?.parentElement) {
		tweetText?.parentElement?.insertBefore(host, tweetText);
	} else {
		article?.parentElement?.insertBefore(host, article);
	}
}

export function processProfilePage(): void {
	if (!isProfilePage()) return;

	const handle = getHandleFromProfileUrl();
	if (!handle) return;

	const userNameEl = findProfileUserName(handle);
	if (!userNameEl?.parentElement) return;

	const categoryLabel = getCategoryLabel(handle);
	if (!categoryLabel) return;

	const message = buildWarningMessage(categoryLabel, { isProfilePage: true });
	const theme = getPageTheme();
	const host = mountHost(userNameEl.parentElement, message, theme);
	if (!host) return;

	userNameEl.after(host);
}

export function refreshRetweetsSummary(): void {
	const lines: SummaryLine[] = Array.from(retweetCountByLabel.entries()).map(([label, count]) => ({
		count,
		label,
	}));
	if (lines.length === 0) return;

	const insertBefore = findRetweetsPageTabBar(document) ?? findFirstUserCell(document);
	if (!insertBefore?.parentElement) return;

	if (retweetSummaryUpdate && retweetSummaryHost) {
		if (!retweetSummaryHost.isConnected) {
			insertBefore.parentElement.insertBefore(retweetSummaryHost, insertBefore);
		}
		retweetSummaryUpdate(lines);
		return;
	}
	const theme = getPageTheme();
	const { host, update } = mountSummaryHost(insertBefore, lines, theme);
	retweetSummaryHost = host;
	retweetSummaryUpdate = update;
}

export function processUserCell(cell: HTMLElement): void {
	const theme = getPageTheme();
	const handle = extractHandleFromUserCell(cell);
	const categoryLabel = handle ? getCategoryLabel(handle) : null;

	if (isRetweetsPage()) {
		const pathname = document.location.pathname;
		if (pathname !== retweetPathname) {
			retweetPathname = pathname;
			retweetCountByLabel.clear();
			retweetSeenHandles.clear();
			retweetSummaryHost = null;
			retweetSummaryUpdate = null;
		}
		if (categoryLabel && handle && !retweetSeenHandles.has(handle)) {
			retweetSeenHandles.add(handle);
			retweetCountByLabel.set(categoryLabel, (retweetCountByLabel.get(categoryLabel) ?? 0) + 1);
		}
	}

	if (!categoryLabel) return;
	const message = buildWarningMessage(categoryLabel);
	if (!message) return;
	const host = mountHost(cell, message, theme);
	if (!host) return;
	cell.parentElement?.insertBefore(host, cell.nextSibling);
}
