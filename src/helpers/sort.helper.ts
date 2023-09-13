import {HarvestTemplate} from 'src/stores/types/harvestTemplate.type';
import {Location} from 'src/stores/types/location.type';

export const sortItemsByLabel = (items: Array<{label: string; value: number}>) =>
  items.sort((a, b) =>
    a.label.localeCompare(b.label, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );

export const sortTemplatesByLocation = (items: Array<HarvestTemplate>) =>
  items.sort((a, b) => assignValueOfNullAtEnd(b.location).localeCompare(assignValueOfNullAtEnd(a.location)));

const assignValueOfNullAtEnd = (location: Omit<Location, 'status'> | null) => (location === null ? '' : location.title);
