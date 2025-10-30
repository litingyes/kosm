<script setup lang="ts">
import type { AIMessage, ContentBlock, HumanMessage } from '@langchain/core/messages'

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

const content = computed(() => {
  if (props.message.type === 'human') {
    return (props.message.content as ContentBlock[]).filter(block => block.type === 'text').map(block => block.text).join('')
  }

  return props.message.content as string
})
</script>

<template>
  <div ref="messageRef" class="text-base text-default flex flex-col gap-1">
    <template v-if="message.type === 'human'">
      <div class="flex items-center justify-end">
        <div class="bg-elevated px-3 py-1.5 rounded-lg">
          {{ content }}
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center">
        <MDC class="*:first:mt-0 *:last:mb-0" :value="content" />
      </div>
    </template>
    <div class="h-7">
      <div v-if="showActionsComputed" class="flex items-center gap-2" :class="{ 'justify-end': message.type === 'human' }">
        <ButtonCopy :content="content" />
      </div>
    </div>
  </div>
</template>
