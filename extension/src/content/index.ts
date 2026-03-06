import { routeChangeObserver, themeObserver, throttledObserve } from "@/lib/observers";
import { mutators, shouldScan } from "./mutators";
import { store } from "./store";

themeObserver((theme) => store.dispatch({ type: "SET_THEME", payload: theme }));
routeChangeObserver(() => store.dispatch({ type: "SYNC_PROFILE_HEADER_BADGE_HOST" }));
throttledObserve(mutators, shouldScan);
