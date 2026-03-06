import { getCategory, getCategoryById } from "@/lib/categories";
import { Badge, RetweetsSummary } from "@/lib/components";
import { render } from "@/lib/render";
import { selectors } from "@/lib/selectors";
import type { Anchor, Mutator } from "@/lib/types";
import { utilities } from "@/lib/utilities";
import { store } from "./store";

export const shouldScan = (node: Node): boolean => {
	if (node.nodeType !== Node.ELEMENT_NODE) return false;

	const theme = selectors.Theme(document.documentElement);
	if (!theme) return false;

	const el = node as HTMLElement;
	if (el.tagName.toLowerCase() === "body") return false;

	const isOurInjectedNode =
		el.getAttribute?.("data-testid")?.startsWith("ir-") === true ||
		el.closest?.("[data-testid^='ir-']") != null;
	if (isOurInjectedNode) return false;

	return true;
};

export const mutators: readonly Mutator[] = [
	// Profile header badge
	{
		id: "ir-profile-header-badge",
		condition: (node) => utilities.isProfilePage() && selectors.ProfileHeader(node) != null,
		getOptions: (node) => {
			const id = "ir-profile-header-badge";
			const handle = utilities.getHandleFromUrl();
			if (!handle) return null;
			const category = getCategory(handle);
			if (!category) return null;

			const headerPhotoLink = selectors.ProfileHeader(node);
			const headerSection = headerPhotoLink?.parentElement;
			if (!headerSection) return null;
			const userName = selectors.UserName(headerSection);
			if (!userName) return null;
			const anchor: Anchor = { element: userName, placement: "appendChild" };
			if (!anchor.element) return null;
			const previousBadge = anchor.element.parentElement?.querySelector<HTMLSpanElement>(
				`[data-testid^='${id}-']`,
			);
			if (previousBadge) return null;

			return { id, handle, anchor, category };
		},
		mutate: ({ id, handle, anchor, category }) => {
			if (!handle || !category?.id || !anchor) return;

			const state = store.getState();
			const { host } = render(anchor, <Badge category={category} theme={state.theme} />, {
				tagName: "span",
				"data-testid": `${id}-${category.id}-${handle.toLowerCase()}`,
			});

			if (anchor.placement === "after") {
				anchor.element.style.display = "inline-flex";
				anchor.element.style.flexWrap = "wrap";
			}

			if (host) store.dispatch({ type: "SET_PROFILE_HEADER_BADGE_HOST", payload: host });
		},
	},
	// Tweet article badge
	{
		id: "ir-tweet-article-badge",
		condition: (node) =>
			selectors.SocialContext(node) != null || selectors.UserDashNameAll(node).length > 0,
		getItems: (node) => Array.from(selectors.TweetArticleAll(node)),
		getOptions: (node) => {
			const id = "ir-tweet-article-badge";
			const handle = utilities.getHandleFromElement(node);
			if (!handle) return null;
			const category = getCategory(handle);
			if (!category) return null;

			if (/Reposted|retweeted/i.test(node.textContent ?? "")) {
				const social = selectors.SocialContext(node);
				if (social != null) {
					const anchor: Anchor = { element: social, placement: "appendChild" };
					const previousBadge = anchor.element.parentElement?.querySelector<HTMLSpanElement>(
						`[data-testid^='${id}']`,
					);
					if (previousBadge) return null;

					return { id, handle, anchor, category };
				}
			}

			const userDashName = selectors.UserDashName(node);
			if (!userDashName) return null;
			const anchor: Anchor = { element: userDashName, placement: "appendChild" };
			if (!anchor.element) return null;
			const previousBadge = anchor.element.parentElement?.querySelector<HTMLSpanElement>(
				`[data-testid^='${id}']`,
			);
			if (previousBadge) return null;

			return { id, handle, anchor, category };
		},
		mutate: ({ id, handle, anchor, category }) => {
			if (!id || !handle || !category || !anchor) return;

			const state = store.getState();

			render(
				anchor,
				<Badge category={category} theme={state.theme} style={{ marginLeft: "8px" }} />,
				{ "data-testid": `${id}-${category.id}-${handle.toLowerCase()}` },
			);
		},
	},
	// User cell badge
	{
		id: "ir-user-cell-badge",
		condition: (node) =>
			node.nodeType === Node.ELEMENT_NODE && selectors.UserCellAll(node).length > 0,
		getItems: (node) => Array.from(selectors.UserCellAll(node)),
		getOptions: (node) => {
			const id = "ir-user-cell-badge";
			const handle = utilities.getHandleFromElement(node);
			if (!handle) return null;
			const category = getCategory(handle);
			if (!category) return null;

			const userLinks = selectors.HandleLinkAll(node, handle);
			if (userLinks.length < 3) return null;
			const anchor: Anchor = { element: userLinks[2], placement: "after" };
			if (!anchor.element) return null;

			return { id, handle, anchor, category };
		},
		mutate: ({ id, handle, anchor, category }) => {
			if (!handle || !category || !anchor) return;

			const previousBadge = anchor.element.parentElement?.querySelector<HTMLSpanElement>(
				`[data-testid^='${id}']`,
			);
			if (previousBadge) return null;

			const state = store.getState();
			render(
				anchor,
				<Badge category={category} theme={state.theme} style={{ marginTop: "4px" }} />,
				{
					"data-testid": `${id}-${handle.toLowerCase()}`,
				},
			);

			if (utilities.isRetweetsPage()) {
				const pathname = document.location.pathname;
				if (pathname !== state.retweetPathname) {
					store.dispatch({ type: "CLEAR_RETWEET_SUMMARY" });
					store.dispatch({ type: "SET_RETWEET_PATHNAME", payload: pathname });
				}
				if (!state.retweetSeenHandles.has(handle)) {
					store.dispatch({
						type: "SET_RETWEET_SEEN_HANDLES",
						payload: new Set([...state.retweetSeenHandles, handle]),
					});
					store.dispatch({
						type: "SET_RETWEET_COUNT",
						payload: {
							id: category.id,
							count: (state.retweetCountById.get(category.id) ?? 0) + 1,
						},
					});
				}
			}
		},
	},
	// Retweets summary
	{
		id: "ir-retweets-summary",
		condition: (node) =>
			utilities.isRetweetsPage() &&
			mutators.find((m) => m.id === "ir-user-cell-badge")?.condition(node) === true,
		getOptions: () => {
			const id = "ir-retweets-summary";
			const anchorElement = selectors.RetweetsPageRepostButton(document.body);
			if (!anchorElement) return null;

			return {
				id,
				anchor: { element: anchorElement, placement: "appendChild" },
			};
		},
		mutate: ({ id, anchor }) => {
			if (!anchor) return;

			const state = store.getState();
			const lines: { count: number; label: string }[] = Array.from(state.retweetCountById.entries())
				.map(([id, count]) => {
					const category = getCategoryById(id);
					if (!category) return null;
					return {
						count,
						label: category.label,
					};
				})
				.filter((line): line is { count: number; label: string } => line !== null);

			if (lines.length === 0) return;
			const summary = lines.map((line) => `${line.count} ${line.label}`);

			if (state.retweetSummaryUpdate && state.retweetSummaryHost) {
				state.retweetSummaryUpdate(summary);
				return;
			}

			const previousSummary = document.body.querySelector<HTMLDivElement>(`[data-testid='${id}']`);
			if (previousSummary) return;

			const { host, update } = render(
				anchor,
				<RetweetsSummary summary={summary} theme={state.theme} style={{ marginLeft: "8px" }} />,
				{ tagName: "div", "data-testid": id },
			);
			const updateWithSummary = (nextSummary: string[]) =>
				update(
					<RetweetsSummary
						summary={nextSummary}
						theme={store.getState().theme}
						style={{ marginLeft: "8px" }}
					/>,
				);
			store.dispatch({ type: "SET_RETWEET_SUMMARY_HOST", payload: host });
			store.dispatch({ type: "SET_RETWEET_SUMMARY_UPDATE", payload: updateWithSummary });
		},
	},
];
