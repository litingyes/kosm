<script setup lang="ts">
import type { AiChatMessage } from '~/composables/useAiChat'

defineProps<{
  messages: AiChatMessage[]
}>()
</script>

<template>
  <div class="flex flex-col gap-2 overflow-auto">
    <AiMessage
      v-for="(message, i) in messages"
      :key="message.id"
      :message="message"
      :show-actions="i === messages.length - 1"
    />
  </div>
</template>
