<script setup lang="ts">
import AppLogo from '@app/components/AppLogo.vue';
import InfoCard from '@app/components/InfoCard.vue';
import { useMessages } from '@app/components/Messages';
import AppMessages from '@app/components/Messages/AppMessages.vue';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import { useAuthStore } from '@app/stores/auth-store';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HttpClient, LoginClient } from '~packages/auth-api-client';
import LoginForm from './LoginForm.vue';

const { t } = useNamespacedI18n('login-page');
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const httpClient = new HttpClient({ baseURL: '/auth', withCredentials: true });
const loginClient = new LoginClient(httpClient);

const username = ref('');
const password = ref('');
const checked = ref(false);
const loading = ref(false);

const { messages, addMessage, clearMessages, removeMessage } = useMessages();

const onSubmit = async () => {
  clearMessages();
  loading.value = true;

  try {
    const response = await loginClient.localCreate({
      username: username.value,
      password: password.value,
    });

    authStore.setUser(response.data.user?.id ?? null);

    const {
      query: { returnUrl: queryReturnUrl },
    } = route;
    const returnUrl =
      typeof queryReturnUrl === 'string' ? queryReturnUrl : { name: 'home' };
    await router.push(returnUrl);
  } catch {
    addMessage({ severity: 'error', content: t('login-error') });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <FloatingMenuCardLayout>
    <InfoCard :title="t('welcome')" :subtitle="t('sign-in-to-continue')">
      <template #icon>
        <AppLogo class="login-page__logo" />
      </template>
      <AppMessages :messages="messages" @close="removeMessage" />
      <LoginForm
        v-model:username="username"
        v-model:password="password"
        v-model:checked="checked"
        v-model:loading="loading"
        @submit="onSubmit"
      />
    </InfoCard>
  </FloatingMenuCardLayout>
</template>

<style scoped lang="scss">
.login-page {
  &__logo {
    width: 4rem;
    margin-bottom: 2rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
