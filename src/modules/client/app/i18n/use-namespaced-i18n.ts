import { useI18n } from 'vue-i18n';

export const useNamespacedI18n = (namespace: string) => {
  const { t } = useI18n();
  const tNs = (key: string) => t(`${namespace}.${key}`);
  return { t: tNs };
};
