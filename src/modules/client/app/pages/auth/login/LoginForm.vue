<script setup lang="ts">
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

const email = defineModel<string>('email');
const password = defineModel<string>('password');
const checked = defineModel<boolean>('checked');
const onSubmit = defineModel<() => void>('submit');

const { t } = useNamespacedI18n('login-form') 
</script>

<template>
  <form
    class="login-form"
    @submit.prevent="typeof onSubmit === 'function' && onSubmit()"
  >
    <div class="login-form__field">
      <label for="email" class="login-form__label">{{ t('email') }}</label>
      <InputText
        id="email"
        v-model="email"
        :placeholder="t('email-placeholder')"
        class="login-form__input"
      />
    </div>
    <div class="login-form__field">
      <label for="password" class="login-form__label">{{ t('password') }}</label>
      <Password
        id="password"
        v-model="password"
        :placeholder="t('password-placeholder')"
        :toggleMask="true"
        :feedback="false"
        class="login-form__input"
      />
    </div>
    <div class="login-form__options">
      <div class="login-form__remember">
        <Checkbox
          v-model="checked"
          id="rememberme"
          binary
          class="login-form__checkbox"
        />
        <label for="rememberme" class="login-form__checkbox-label"
          >{{ t('remember-me') }}</label
        >
      </div>
      <span class="login-form__forgot">{{ t('forgot-password') }}</span>
    </div>
    <Button :label="t('sign-in')" class="login-form__button" type="submit" />
  </form>
</template>

<style scoped lang="scss">
.login-form {
  width: 100%;
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-weight: 500;
    font-size: 1.1rem;
    color: var(--p-text-color);
  }

  &__input {
    width: 100%;
  }

  &__options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  &__remember {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__checkbox {
    margin-right: 0.25rem;
  }

  &__checkbox-label {
    font-size: 1rem;
    color: var(--p-text-color-secondary);
  }

  &__forgot {
    font-size: 1rem;
    color: var(--primary-color);
    cursor: pointer;
    text-align: right;
    font-weight: 500;
  }

  &__button {
    width: 100%;
    margin-top: 1rem;
  }
}

// Fix: PrimeVue Password's internal input does not expand to 100% width by default.
// This ensures the input fills the parent container as expected in forms.
.login-form :deep(.p-password) {
  width: 100%;
  .p-inputtext {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
