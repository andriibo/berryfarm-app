export const sortItemsByLabel = (items: Array<{label: string; value: number}>) =>
  items.sort((a, b) =>
    a.label.localeCompare(b.label, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );
