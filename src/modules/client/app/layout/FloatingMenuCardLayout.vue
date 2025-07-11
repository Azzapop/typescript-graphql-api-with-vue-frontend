<script setup lang="ts">
import FloatingMenuLayout from './FloatingMenuLayout.vue';
</script>

<template>
  <FloatingMenuLayout>
    <div class="floating-menu-card-layout__wrapper">
      <div class="floating-menu-card-layout__inner">
        <slot />
      </div>
    </div>
  </FloatingMenuLayout>
</template>

<style scoped lang="scss">
.floating-menu-card-layout__wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-ground, #f4f4f4);
}

.floating-menu-card-layout__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>