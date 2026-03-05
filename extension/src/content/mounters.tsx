import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RETWEETS_SUMMARY_HOST_CLASS, WARNING_HOST_CLASS } from "./selectors";

export function mountHost(
	article: HTMLElement,
	message: string,
	theme: "light" | "dark",
): HTMLDivElement | null {
	if (article.querySelector(`.${WARNING_HOST_CLASS}`)) return null;

	const host = document.createElement("div");
	host.className = WARNING_HOST_CLASS;
	const mount = document.createElement("div");
	const shadow = host.attachShadow({ mode: "open" });
	const style = document.createElement("style");
	style.textContent = ":host { display: block; }";

	shadow.appendChild(style);
	shadow.appendChild(mount);

	createRoot(mount).render(<Warning message={message} theme={theme} />);
	return host;
}

export type SummaryLine = { readonly count: number; readonly label: string };

export type SummaryHostResult = {
	readonly host: HTMLDivElement;
	update(lines: readonly SummaryLine[]): void;
};

export function mountSummaryHost(
	insertBefore: HTMLElement,
	lines: readonly SummaryLine[],
	theme: "light" | "dark",
): SummaryHostResult {
	const host = document.createElement("div");
	host.className = RETWEETS_SUMMARY_HOST_CLASS;
	const mount = document.createElement("div");
	const shadow = host.attachShadow({ mode: "open" });
	const style = document.createElement("style");
	style.textContent = ":host { display: block; }";
	shadow.appendChild(style);
	shadow.appendChild(mount);

	const root = createRoot(mount);
	root.render(<RetweetsSummary lines={lines} theme={theme} />);
	insertBefore.parentElement?.insertBefore(host, insertBefore);

	function update(newLines: readonly SummaryLine[]): void {
		root.render(<RetweetsSummary lines={newLines} theme={theme} />);
	}
	return { host, update };
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

function RetweetsSummary(props: { lines: readonly SummaryLine[]; theme: "light" | "dark" }) {
	const isLight = props.theme === "light";
	const style: React.CSSProperties = {
		display: "block",
		margin: "12px 8px",
		padding: "8px 12px",
		borderRadius: "8px",
		fontSize: "14px",
		lineHeight: "1.5",
		...(isLight ? LIGHT_STYLES : DARK_STYLES),
	};

	useEffect(() => {
		return () => {
			console.log("unmount");
		};
	}, []);

	return (
		<div role="alert" style={style}>
			<p style={{ margin: "0 0 8px 0", fontWeight: 600 }}>
				Warning: this post has been retweeted by:
			</p>
			<ol style={{ margin: 0, paddingLeft: "20px" }}>
				{props.lines.map((line) => (
					<li key={`${line.label}-${line.count}`}>
						{line.count} {line.label}
					</li>
				))}
			</ol>
		</div>
	);
}
