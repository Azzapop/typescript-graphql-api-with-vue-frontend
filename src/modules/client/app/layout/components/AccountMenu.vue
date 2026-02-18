<script setup lang="ts">
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import { useAuthStore } from '@app/stores/auth-store';
import { useRouter } from 'vue-router';
import { HttpClient, LogoutClient } from '~packages/auth-api-client';

const { t } = useNamespacedI18n('account-menu');
const router = useRouter();
const authStore = useAuthStore();

const httpClient = new HttpClient({ baseURL: '/auth', withCredentials: true });
const logoutClient = new LogoutClient(httpClient);

const goToProfile = () => {
  router.push({ name: 'user-profile' });
};

const logout = async () => {
  try {
    await logoutClient.logoutDelete();

    // Clear auth store
    authStore.setUser(null);

    // Redirect to returnUrl or home
    await router.push({ name: 'login' });
  } catch (e: unknown) {
    console.log('Error logging out');
    // Client side errors
  }
};
</script>

<template>
  <div class="account-menu">
    <button @click="goToProfile" type="button" class="account-menu__item">
      <i class="pi pi-user-edit account-menu__icon"></i>
      <span class="account-menu__label">{{ t('profile') }}</span>
    </button>
    <button @click="logout" type="button" class="account-menu__item">
      <i class="pi pi-sign-out account-menu__icon"></i>
      <span class="account-menu__label">{{ t('logout') }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.account-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 12rem;
  padding: 0.5rem;

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--content-border-radius);
    color: var(--text-color);
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: background-color var(--transition-duration);
    text-align: left;
    width: 100%;

    &:hover {
      background-color: var(--surface-hover);
    }

    &:focus-visible {
      outline-width: var(--focus-ring-width);
      outline-style: var(--focus-ring-style);
      outline-color: var(--focus-ring-color);
      outline-offset: var(--focus-ring-offset);
      box-shadow: var(--focus-ring-shadow);
    }
  }

  &__icon {
    font-size: 1rem;
    color: var(--text-color-secondary);
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
  }
}
</style>
