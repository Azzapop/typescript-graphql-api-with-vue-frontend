import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';

export const presets = {
  Aura,
  Lara,
} as const;

export type PresetName = keyof typeof presets;
