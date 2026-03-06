import React from "react";
import type { Category, Theme } from "./types";

type BadgeProps = {
	category: Category;
	theme: Theme;
	style?: React.CSSProperties;
};
const VARIANT_THEME_STYLES: Record<"gray" | "red", Record<Theme, React.CSSProperties>> = {
	gray: {
		light: {
			border: "1px solid rgba(107, 114, 128, 0.5)",
			color: "rgb(75, 85, 99)",
			backgroundColor: "rgba(107, 114, 128, 0.12)",
		},
		dark: {
			border: "1px solid rgba(156, 163, 175, 0.4)",
			color: "rgb(209, 213, 219)",
			backgroundColor: "rgba(107, 114, 128, 0.15)",
		},
	},
	red: {
		light: {
			border: "1px solid rgba(185, 28, 28, 0.5)",
			color: "rgb(127, 29, 29)",
			backgroundColor: "rgba(185, 28, 28, 0.12)",
		},
		dark: {
			border: "1px solid rgba(248, 113, 113, 0.4)",
			color: "rgb(254, 202, 202)",
			backgroundColor: "rgba(185, 28, 28, 0.15)",
		},
	},
};
export function Badge({ category, theme, style: styleProps }: BadgeProps) {
	const variantStyles = VARIANT_THEME_STYLES[category.variant][theme];
	const style: React.CSSProperties = {
		display: "inline-block",
		padding: "2px 8px",
		borderRadius: "8px",
		fontSize: "12px",
		lineHeight: "1.3",
		...variantStyles,
		...styleProps,
	};
	return <span style={style}>{category.label}</span>;
}

type RetweetsSummaryProps = {
	readonly summary: string[];
	readonly theme: Theme;
	readonly style?: React.CSSProperties;
};
export function RetweetsSummary({ summary, theme, style: styleProps }: RetweetsSummaryProps) {
	const variantStyles = VARIANT_THEME_STYLES.gray[theme];

	const style: React.CSSProperties = {
		display: "inline-block",
		padding: "2px 8px",
		borderRadius: "8px",
		fontSize: "12px",
		lineHeight: "1.3",
		...variantStyles,
		...styleProps,
	};

	return (
		<span style={style}>
			{summary.map((line) => (
				<span key={line} style={{ display: "block" }}>
					{line}
				</span>
			))}
		</span>
	);
}
