import { createJavaScriptRegexEngine } from 'shiki'
import { createHighlighterCoreSync } from 'shiki/core'
import langHtml from 'shiki/langs/html.mjs'
import langJson from 'shiki/langs/json.mjs'
import langMarkdown from 'shiki/langs/markdown.mjs'
import themeCatppuccinLatte from 'shiki/themes/catppuccin-latte.mjs'
import themeCatppuccinMocha from 'shiki/themes/catppuccin-mocha.mjs'

export const useShiki = createSharedComposable(() => {
  const highlighter = shallowRef(createHighlighterCoreSync({
    engine: createJavaScriptRegexEngine(),
    themes: [themeCatppuccinLatte, themeCatppuccinMocha],
    langs: [langHtml, langJson, langMarkdown],
  }))

  const loadedLanguages = computed(() => {
    return highlighter.value.getLoadedLanguages()
  })
  const validLanguageNames = computed(() => {
    const names: string[] = []

    loadedLanguages.value.forEach((lang) => {
      const grammar = highlighter.value.getLanguage(lang)
      names.push(grammar.name)

      // @ts-expect-error _grammar
      names.push(...(grammar?._grammar?.aliases || []))
    })

    return names.filter(Boolean)
  })
  const isValidLanguageName = (lang: string) => {
    return validLanguageNames.value.includes(lang)
  }

  const getLanguageDisplayName = (lang: string) => {
    if (!isValidLanguageName(lang)) {
      return 'Text'
    }

    const grammar = highlighter.value.getLanguage(lang)

    // @ts-expect-error _grammar
    return grammar?._grammar?.displayName || lang
  }

  onScopeDispose(() => {
    highlighter.value.dispose()
  })

  return {
    highlighter,

    loadedLanguages,
    validLanguageNames,
    isValidLanguageName,
    getLanguageDisplayName,

  }
})
