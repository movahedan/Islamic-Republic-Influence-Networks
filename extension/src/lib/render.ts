import { createRoot, type Root } from "react-dom/client";
import type { Anchor } from "./types";

type RenderOptions = {
	readonly tagName?: "div" | "span";
	readonly "data-testid"?: string;
};

export function render(
	anchor: Anchor,
	component: React.ReactNode,
	{ tagName = "span", "data-testid": dataTestId = "" }: RenderOptions = {},
): {
	readonly host: HTMLElement;
	readonly mount: HTMLElement;
	readonly root: Root;
	readonly update: (component: React.ReactNode) => void;
} {
	const host = document.createElement(tagName) as HTMLElement;
	host.setAttribute("data-testid", dataTestId);
	const mount = document.createElement(tagName);
	const shadow = host.attachShadow({ mode: "open" });
	const styleElement = document.createElement("style");
	styleElement.textContent = `:host { display: ${tagName === "span" ? "inline-block" : "block"}; }`;
	shadow.appendChild(styleElement);
	shadow.appendChild(mount);
	const root = createRoot(mount);
	root.render(component);
	if (anchor.placement === "appendChild") {
		anchor.element.appendChild(host);
	} else {
		anchor.element.after(host);
	}

	function update(component: React.ReactNode): void {
		root.render(component);
	}

	return { host, mount, root, update };
}
