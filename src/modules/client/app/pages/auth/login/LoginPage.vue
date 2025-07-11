<script setup lang="ts">
import { ref } from 'vue';
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import InfoCard from '@app/components/InfoCard.vue';
import LoginForm from './LoginForm.vue';
import AppLogo from '@app/components/AppLogo.vue';

const email = ref('');
const password = ref('');
const checked = ref(false);

function onSubmit() {
  // handle login logic here
  // e.g., call an API or route to dashboard
  console.log({ email: email.value, password: password.value, checked: checked.value });
}
</script>

<template>
  <FloatingMenuCardLayout>
    <InfoCard title="Welcome to PrimeLand!" subtitle="Sign in to continue">
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
  &__wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-ground);
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  &__logo {
    width: 4rem;
    margin-bottom: 2rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
