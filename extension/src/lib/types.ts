export type Theme = "light" | "dark";

export type Category = {
	readonly id: string;
	readonly label: string;
	readonly variant: "gray" | "red";
};

export type Anchor =
	| { readonly element: HTMLElement; readonly placement: "after" }
	| { readonly element: HTMLElement; readonly placement: "appendChild" };

const mutatorIds = [
	"ir-profile-header-badge",
	"ir-user-cell-badge",
	"ir-tweet-article-badge",
	"ir-retweets-summary",
] as const;

type MutatorOptions = {
	readonly id: (typeof mutatorIds)[number];
	readonly handle?: string;
	readonly anchor?: Anchor;
	readonly category?: Category;
};

export type Mutator = {
	readonly id: (typeof mutatorIds)[number];
	readonly condition: (node: HTMLElement) => boolean;
	readonly getItems?: (node: HTMLElement) => HTMLElement[];
	readonly getOptions: (node: HTMLElement) => MutatorOptions | null;
	readonly mutate: (options: MutatorOptions, node: HTMLElement) => void;
};
