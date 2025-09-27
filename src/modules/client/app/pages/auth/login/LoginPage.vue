<script setup lang="ts">
import AppLogo from '@app/components/AppLogo.vue';
import InfoCard from '@app/components/InfoCard.vue';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import { ref } from 'vue';
import LoginForm from './LoginForm.vue';

const { t } = useNamespacedI18n('login-page');

const email = ref('');
const password = ref('');
const checked = ref(false);

const onSubmit = () => {
  // handle login logic here
  // e.g., call an API or route to dashboard
  console.log({
    email: email.value,
    password: password.value,
    checked: checked.value,
  });
};
</script>

<template>
  <FloatingMenuCardLayout>
    <InfoCard :title="t('welcome')" :subtitle="t('sign-in-to-continue')">
      <template #icon>
        <AppLogo class="login-page__logo" />
      </template>
      <LoginForm
        v-model:email="email"
        v-model:password="password"
        v-model:checked="checked"
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
