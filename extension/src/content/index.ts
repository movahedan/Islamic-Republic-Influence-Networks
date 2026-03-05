import {
	extractHandle,
	findActionBar,
	findProfileUserName,
	findTweetText,
	getHandleFromProfileUrl,
	getPageTheme,
	isProfilePage,
	isRetweet,
} from "./dom-extractors";
import { getCategoryLabel } from "./get-category-label";
import { mountHost } from "./mount-host";
import { observeAndProcess } from "./observe";

type WarningMessageProps = {
	isRetweet?: boolean;
	isProfilePage?: boolean;
};

function buildWarningMessage(categoryLabel: string, props: WarningMessageProps): string {
	return props.isProfilePage
		? `Warning: This profile is a ${categoryLabel} account`
		: props.isRetweet
			? `Warning: This tweet has been retweeted by a ${categoryLabel} account`
			: `Warning: This tweet has been sent from a ${categoryLabel} account`;
}

function processTweet(article: HTMLElement): void {
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

function processProfilePage(): void {
	const theme = getPageTheme();
	if (!isProfilePage()) return;

	const handle = getHandleFromProfileUrl();
	if (!handle) return;

	const userNameEl = findProfileUserName(handle);
	if (!userNameEl?.parentElement) return;

	const categoryLabel = getCategoryLabel(handle);
	if (!categoryLabel) return;

	const message = buildWarningMessage(categoryLabel, { isProfilePage: true });
	const host = mountHost(userNameEl.parentElement, message, theme);
	if (!host) return;

	userNameEl.after(host);
}

observeAndProcess(processTweet, processProfilePage);
