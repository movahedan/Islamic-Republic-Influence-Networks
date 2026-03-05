import React from "react";
import { createRoot } from "react-dom/client";

export function mountHost(
	article: HTMLElement,
	message: string,
	theme: "light" | "dark",
): HTMLDivElement | null {
	if (article.querySelector(".ir-warning-host")) return null;

	const host = document.createElement("div");
	host.className = "ir-warning-host";
	const mount = document.createElement("div");
	const shadow = host.attachShadow({ mode: "open" });
	const style = document.createElement("style");
	style.textContent = ":host { display: block; }";

	shadow.appendChild(style);
	shadow.appendChild(mount);

	createRoot(mount).render(<Warning message={message} theme={theme} />);
	return host;
}

const LIGHT_STYLES: React.CSSProperties = {
	border: "1px solid rgba(234, 179, 8, 0.5)",
	color: "rgb(120, 53, 15)",
	backgroundColor: "rgba(234, 179, 8, 0.12)",
};

const DARK_STYLES: React.CSSProperties = {
	border: "1px solid rgba(234, 179, 8, 0.4)",
	color: "rgb(253, 224, 71)",
	backgroundColor: "rgba(234, 179, 8, 0.15)",
};

function Warning(props: { message: string; theme?: "light" | "dark" }) {
	const isLight = props.theme === "light";
	const style: React.CSSProperties = {
		display: "block",
		margin: "12px 8px",
		padding: "8px 12px",
		borderRadius: "8px",
		fontSize: "14px",
		lineHeight: "1.4",
		...(isLight ? LIGHT_STYLES : DARK_STYLES),
	};

	return (
		<div role="alert" style={style}>
			{props.message}
		</div>
	);
}
