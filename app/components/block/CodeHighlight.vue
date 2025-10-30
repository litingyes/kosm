<script setup lang="ts">
const props = withDefaults(defineProps<{
  value?: string
  lang?: string
}>(), {
  value: '',
  lang: 'text',
})

const { highlighter, isValidLanguageName, getLanguageDisplayName } = useShiki()
const languageDisplayName = computed(() => getLanguageDisplayName(props.lang))

const htmlContent = computed(() => {
  return highlighter.value.codeToHtml(props.value, {
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
    lang: isValidLanguageName(props.lang) ? props.lang : 'text',
  })
})

const icon = computed(() => {
  switch (languageDisplayName.value) {
    case 'HTML':
      return 'i-material-icon-theme:html'
    case 'JSON':
      return 'i-material-icon-theme:json'
    case 'Markdown':
      return 'i-material-icon-theme:markdown'
    default:
      return 'i-lucide:code'
  }
})
</script>

<template>
  <div class="bg-muted rounded-xl my-4">
    <div class="flex items-center justify-between px-4 py-2">
      <div class="flex items-center gap-1">
        <UIcon :name="icon" :size="20" />
        <div class="text-sm font-semibold text-highlighted">
          {{ languageDisplayName }}
        </div>
      </div>
      <div>
        <ButtonCopy :content="props.value" />
      </div>
    </div>
    <div class="p-4 pt-0" v-html="htmlContent" />
  </div>
</template>

<style>
.shiki {
  background-color: transparent !important;
}

html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
</style>
