<script setup lang="ts">
import type { AIMessage, HumanMessage } from '@langchain/core/messages'

defineProps<{
  message: HumanMessage | AIMessage
}>()
</script>

<template>
  <div class="text-base text-default">
    <template v-if="message.type === 'human'">
      <div class="flex items-center justify-end ">
        <div class="bg-elevated px-3 py-1.5 rounded-lg">
          {{ message.content }}
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center">
        <AiMarkdown :content="message.content as string" stream />
      </div>
    </template>
  </div>
</template>
