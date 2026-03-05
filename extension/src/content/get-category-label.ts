import handlesData from "../data/handles.json";

type HandlesData = {
	handlesByCategory: Record<string, string[]>;
	categoryLabels: Record<string, string>;
};

const { handlesByCategory, categoryLabels } = handlesData as HandlesData;

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

export function getCategoryLabel(handle: string): string | null {
	const id = handleToCategoryIds.get(handle.toLowerCase())?.[0];
	return id != null ? (categoryLabels[id] ?? id) : null;
}
