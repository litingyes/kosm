import process from 'node:process'

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: {
    enabled: true,
  },
  pages: {
    pattern: ['**\/*.vue', '!**\/components\/*.vue'],
  },
  runtimeConfig: {
    public: {
      defaultModel: process.env.AI_OPEN_ROUTER_DEFAULT_MODEL,
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  ui: {
    fonts: false,
  },
})
