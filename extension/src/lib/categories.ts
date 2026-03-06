import handlesData from "@/data/handles.json";
import type { Category } from "./types";

type HandlesData = {
	handlesByCategory: Record<string, string[]>;
	categoryLabels: Record<string, string>;
};

const { handlesByCategory, categoryLabels } = handlesData as HandlesData;
const categoryVariants: Record<string, Category["variant"]> = {
	"ir-x-network": "gray",
	mek: "red",
};

const handleToCategoryIds = Object.entries(handlesByCategory).reduce(
	(map, [categoryId, handles]) =>
		handles.reduce((acc, h) => {
			const key = h.toLowerCase();
			const existing = acc.get(key);
			if (existing) existing.push(categoryId);
			else acc.set(key, [categoryId]);
			return acc;
		}, map),
	new Map<string, string[]>(),
);

function getHandleCategoryId(handle: string): string | null {
	return handleToCategoryIds.get(handle.toLowerCase())?.[0] ?? null;
}

export function getCategory(handle: string): Category | null {
	const categoryId = getHandleCategoryId(handle);
	if (categoryId === null) return null;
	return getCategoryById(categoryId);
}

export function getCategoryById(categoryId: string): Category | null {
	const label = categoryLabels[categoryId];
	if (label == null) return null;
	const variant = categoryVariants[categoryId] ?? "gray";
	return {
		id: categoryId,
		label,
		variant,
	};
}
