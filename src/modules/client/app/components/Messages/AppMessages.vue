<script setup lang="ts">
import Message from 'primevue/message';
import type { AppMessage } from './messages-types';

const props = defineProps<{ messages: AppMessage[] }>();

const emit = defineEmits<{ close: [id: string] }>();
</script>

<template>
  <div v-if="props.messages.length" class="messages">
    <Message
      v-for="msg in props.messages"
      :key="msg.id"
      :severity="msg.severity"
      :closable="msg.closable"
      @close="emit('close', msg.id)"
    >
      {{ msg.content }}
    </Message>
  </div>
</template>

<style scoped lang="scss">
.messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
</style>
