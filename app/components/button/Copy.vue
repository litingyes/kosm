<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

const { copy, copied } = useClipboard({
  source: props.content,
  legacy: true,
})
</script>

<template>
  <UTooltip :text="copied ? 'Copied' : 'Copy'">
    <UButton
      :icon="copied ? 'i-lucide-circle-check' : 'i-lucide-copy'"
      variant="ghost"
      size="sm"
      :color="copied ? 'success' : 'neutral'"
      @click="copy(content)"
    />
  </UTooltip>
</template>
