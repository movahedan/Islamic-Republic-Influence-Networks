import type { Theme } from "@/lib/types";

export type StoreState = {
	readonly theme: Theme;
	readonly profileHeaderBadgeHost: HTMLSpanElement | null;
	readonly retweetCountById: Map<string, number>;
	readonly retweetSeenHandles: Set<string>;
	readonly retweetSummaryHost: HTMLElement | null;
	readonly retweetSummaryUpdate: ((summary: string[]) => void) | null;
	readonly retweetPathname: string;
};

const initialState: StoreState = {
	theme: "dark",
	profileHeaderBadgeHost: null,
	retweetCountById: new Map(),
	retweetSeenHandles: new Set(),
	retweetSummaryHost: null,
	retweetSummaryUpdate: null,
	retweetPathname: "",
};

export type StoreAction =
	| { readonly type: "SET_THEME"; readonly payload: Theme }
	| { readonly type: "SET_PROFILE_HEADER_BADGE_HOST"; readonly payload: HTMLSpanElement | null }
	| { readonly type: "SYNC_PROFILE_HEADER_BADGE_HOST" }
	| { readonly type: "SET_RETWEET_COUNT"; readonly payload: { id: string; count: number } }
	| { readonly type: "SET_RETWEET_SEEN_HANDLES"; readonly payload: Set<string> }
	| { readonly type: "SET_RETWEET_SUMMARY_HOST"; readonly payload: HTMLElement | null }
	| {
			readonly type: "SET_RETWEET_SUMMARY_UPDATE";
			readonly payload: ((summary: string[]) => void) | null;
	  }
	| { readonly type: "CLEAR_RETWEET_SUMMARY" }
	| { readonly type: "SET_RETWEET_PATHNAME"; readonly payload: string };

function reducer(state: StoreState, action: StoreAction): StoreState {
	switch (action.type) {
		case "SET_THEME":
			return { ...state, theme: action.payload };
		case "SET_PROFILE_HEADER_BADGE_HOST":
			return { ...state, profileHeaderBadgeHost: action.payload };
		case "SYNC_PROFILE_HEADER_BADGE_HOST": {
			if (state.profileHeaderBadgeHost?.isConnected) {
				state.profileHeaderBadgeHost.remove();
				return { ...state, profileHeaderBadgeHost: null };
			}

			return state;
		}
		case "SET_RETWEET_COUNT": {
			const next = new Map(state.retweetCountById);
			next.set(action.payload.id, action.payload.count);
			return { ...state, retweetCountById: next };
		}
		case "SET_RETWEET_SEEN_HANDLES":
			return { ...state, retweetSeenHandles: action.payload };
		case "SET_RETWEET_SUMMARY_HOST":
			return { ...state, retweetSummaryHost: action.payload };
		case "SET_RETWEET_SUMMARY_UPDATE":
			return { ...state, retweetSummaryUpdate: action.payload };
		case "CLEAR_RETWEET_SUMMARY":
			return {
				...state,
				retweetCountById: new Map(),
				retweetSeenHandles: new Set(),
				retweetSummaryHost: null,
				retweetSummaryUpdate: null,
			};
		case "SET_RETWEET_PATHNAME":
			return { ...state, retweetPathname: action.payload };
		default:
			return state;
	}
}

function createStore(init: StoreState, reduce: (s: StoreState, a: StoreAction) => StoreState) {
	let state = init;

	function getState(): StoreState {
		return state;
	}

	function dispatch(action: StoreAction): StoreAction {
		state = reduce(state, action);
		return action;
	}

	return { getState, dispatch };
}

export const store = createStore(initialState, reducer);
