<script setup lang="ts">
const sidebarCollapsed = ref(false)

const prompt = ref('')

const { messages, send } = useAiChat({
  model: {
    provider: 'default',
  },
})
function onSend() {
  send(prompt.value)
  prompt.value = ''
}
</script>

<template>
  <UDashboardGroup storage-key="kosm-app-chat-sidebar">
    <UDashboardSidebar
      v-model:collapsed="sidebarCollapsed"
      resizable
      collapsible
      :default-size="20"
      :min-size="15"
      :max-size="30"
      :ui="{ footer: 'py-6' }"
    >
      <template #header="{ collapsed }">
        <div v-if="!collapsed" class="w-full flex items-center justify-between">
          <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
          <UDashboardSidebarCollapse />
        </div>
        <UIcon v-else name="i-lucide-sparkles" class="size-5 text-primary mx-auto" />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel class="flex flex-col">
      <template #header>
        <UDashboardNavbar title="Kosm">
          <template v-if="sidebarCollapsed" #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #right>
            <UColorModeButton />
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <AiMessages :messages="messages" />
      </template>
      <template #footer>
        <div class="p-6">
          <UChatPrompt v-model="prompt" placeholder="Ask anything..." :maxrows="6" @submit="onSend">
            <template #footer>
              <div class="w-full flex items-center justify-between">
                <div />
                <UChatPromptSubmit />
              </div>
            </template>
          </UChatPrompt>
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
