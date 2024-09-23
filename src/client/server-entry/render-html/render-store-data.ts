import type { StateTree } from 'pinia';

export const renderStoreData = (
  storeData: Record<string, StateTree>
): string => {
  const dataString = JSON.stringify(storeData);

  return `<script>window.__app_store = '${dataString}';</script>`;
};
