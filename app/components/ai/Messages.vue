<script setup lang="ts">
import type { AiChatMessage } from '~/composables/useAiChat'

defineProps<{
  messages: AiChatMessage[]
}>()
</script>

<template>
  <div class="flex flex-col gap-2 overflow-auto">
    <AiMessage v-for="message in messages" :key="message.id" :message="message" />
  </div>
</template>
