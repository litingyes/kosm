<script setup lang="ts">
import type { AIMessage, HumanMessage } from '@langchain/core/messages'

defineProps<{
  message: HumanMessage | AIMessage
}>()
</script>

<template>
  <div v-if="message.type === 'human'">
    <div class="flex items-center justify-end ">
      <div class="text-sm bg-elevated px-2 py-1 rounded-lg">
        {{ message.content }}
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex items-center">
      <div class="text-sm text-default">
        <AiMarkdown :content="message.content as string" stream />
      </div>
    </div>
  </div>
</template>
