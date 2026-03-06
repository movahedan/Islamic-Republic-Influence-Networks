export const selectors = {
	Theme: (el: HTMLElement | Element) => el.getAttribute("data-theme"),
	ActionBar: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('[data-testid="reply"]')?.closest('div[role="group"]'),
	ProfileHeader: (el: HTMLElement | Element) =>
		el.querySelector<HTMLAnchorElement>("a[href$='/header_photo']"),
	HandleLink: (el: HTMLElement | Element, handle: string) =>
		el.querySelector<HTMLAnchorElement>(`a[href^="/${handle}"]`),
	HandleLinkAll: (el: HTMLElement | Element, handle: string) =>
		el.querySelectorAll<HTMLAnchorElement>(`a[href^="/${handle}"]`),
	TweetArticle: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('article[role="article"]'),
	TweetArticleAll: (el: HTMLElement | Element) =>
		el.querySelectorAll<HTMLElement>('article[role="article"]'),
	Text: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('div[data-testid="tweetText"]'),
	TextAll: (el: HTMLElement | Element) =>
		el.querySelectorAll<HTMLElement>('div[data-testid="tweetText"]'),
	SocialContext: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('[data-testid="socialContext"]'),
	SocialContextAll: (el: HTMLElement | Element) =>
		el.querySelectorAll<HTMLElement>('[data-testid="socialContext"]'),
	UserName: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('[data-testid="UserName"]'),
	UserNameAll: (el: HTMLElement | Element) =>
		el.querySelectorAll<HTMLElement>('[data-testid="UserName"]'),
	UserCell: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('[data-testid="UserCell"]'),
	UserCellAll: (el: HTMLElement | Element) =>
		el.querySelectorAll<HTMLElement>('[data-testid="UserCell"]'),
	UserDashName: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('[data-testid="User-Name"]'),
	UserDashNameAll: (el: HTMLElement | Element) =>
		el.querySelectorAll<HTMLElement>('[data-testid="User-Name"]'),
	RetweetsPageTabBar: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('[role="navigation"]:has([role="tablist"])'),
	RetweetsPageRepostButton: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>(
			'nav[role="navigation"] [role="tablist"] a[href$="/retweets"]>div>div',
		),
	RetweetsPageTab: (el: HTMLElement | Element) =>
		el.querySelector<HTMLElement>('[role="tablist"] [role="tab"]'),
};
