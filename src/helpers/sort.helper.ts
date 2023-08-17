export const sortItemsByLabel = (items: Array<{label: string; id: number}>) =>
  items.sort((a, b) => a.label.localeCompare(b.label));
