export const STORAGE_KEYS = {
  LEADS_FILTER: "leads-filter-state",
  LEADS_TABLE_SORT: "leads-table-sort",
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
