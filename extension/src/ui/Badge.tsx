import type React from "react";

const DISCLAIMER_TITLE =
	"This label is based on a public research dataset and may contain errors. Do not use for harassment or targeting.";

export type PageTheme = "light" | "dark";

const LIGHT_STYLES: React.CSSProperties = {
	border: "1px solid rgba(0,0,0,0.2)",
	color: "rgb(15, 20, 25)",
	backgroundColor: "rgba(0,0,0,0.06)",
};

const DARK_STYLES: React.CSSProperties = {
	border: "1px solid rgba(255,255,255,0.3)",
	color: "rgb(247, 249, 249)",
	backgroundColor: "rgba(255,255,255,0.1)",
};

export function Badge(props: {
	text: string;
	title?: string;
	href?: string;
	theme?: PageTheme;
}) {
	const title = props.title ?? DISCLAIMER_TITLE;
	const isLight = props.theme === "light";
	const themeStyles = isLight ? LIGHT_STYLES : DARK_STYLES;
	const style: React.CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		borderRadius: "999px",
		padding: "2px 8px",
		fontSize: "12px",
		lineHeight: "16px",
		opacity: 0.9,
		textDecoration: "none",
		cursor: props.href ? "pointer" : "default",
		...themeStyles,
	};

	if (props.href) {
		return (
			<a href={props.href} target="_blank" rel="noopener noreferrer" title={title} style={style}>
				{props.text}
			</a>
		);
	}

	return (
		<span title={title} style={style}>
			{props.text}
		</span>
	);
}
