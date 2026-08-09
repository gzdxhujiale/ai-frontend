<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTenantStore } from '../stores/tenant'

const route = useRoute()
const tenantStore = useTenantStore()
const title = computed(() => String(route.meta.title ?? '页面'))
</script>

<template>
  <div class="placeholder-view">
    <a-card :bordered="false">
      <a-result status="success" :title="title" :subtitle="`当前租户：${tenantStore.currentTenant.name}。这里是路由与菜单示例页面。`">
        <template #extra><a-button type="primary">开始配置</a-button></template>
      </a-result>
    </a-card>
  </div>
</template>
