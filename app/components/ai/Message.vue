<script setup lang="ts">
import type { AIMessage, HumanMessage } from '@langchain/core/messages'

const props = withDefaults(defineProps<{
  message: HumanMessage | AIMessage
  showActions?: boolean
}>(), {
  showActions: false,
})

const messageRef = useTemplateRef<HTMLDivElement>('messageRef')
const isHovered = useElementHover(messageRef)

const showActionsComputed = computed(() => {
  return props.showActions || isHovered.value
})
</script>

<template>
  <div ref="messageRef" class="text-base text-default flex flex-col gap-1">
    <template v-if="message.type === 'human'">
      <div class="flex items-center justify-end">
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
    <div class="h-7">
      <div v-if="showActionsComputed" class="flex items-center gap-2" :class="{ 'justify-end': message.type === 'human' }">
        <ButtonCopy :content="message.content as string" />
      </div>
    </div>
  </div>
</template>
