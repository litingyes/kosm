<script setup lang="ts">
const sidebarCollapsed = ref(false)
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
    >
      <template #header="{ collapsed }">
        <div v-if="!collapsed" class="w-full flex items-center justify-between">
          <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />

          <UDashboardSidebarCollapse />
        </div>
        <UIcon v-else name="i-lucide-sparkles" class="size-5 text-primary mx-auto" />
      </template>
      <template #footer="{ collapsed }">
        <UColorModeButton v-if="collapsed" />
        <UColorModeSelect v-else variant="soft" :ui="{ base: 'w-full' }" />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel class="flex flex-col">
      <template #header>
        <UDashboardNavbar title="Kosm">
          <template v-if="sidebarCollapsed" #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
