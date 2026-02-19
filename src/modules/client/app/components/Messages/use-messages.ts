import { ref } from 'vue';
import { generateMessageId } from './generate-message-id';
import type { AddMessageInput, AppMessage } from './messages-types';

export const useMessages = () => {
  const messages = ref<AppMessage[]>([]);

  const addMessage = (msg: AddMessageInput): void => {
    messages.value.push({
      ...msg,
      id: generateMessageId(),
      closable: msg.closable ?? true,
    });
  };

  const removeMessage = (id: string): void => {
    messages.value = messages.value.filter((m) => m.id !== id);
  };

  const clearMessages = (): void => {
    messages.value = [];
  };

  return { messages, addMessage, removeMessage, clearMessages };
};
