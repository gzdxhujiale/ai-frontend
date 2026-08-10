<script setup lang="ts">
import { computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconApps,
  IconMoonFill,
  IconNotification,
  IconSettings,
  IconUser,
} from '@arco-design/web-vue/es/icon'
import { menuIconMap } from './config/routes'
import { useAppStore } from './stores/app'
import { useTenantStore } from './stores/tenant'
import { useUserStore } from './stores/user'
import { buildMenuItems } from './utils/permission'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const tenantStore = useTenantStore()
const userStore = useUserStore()

const menuItems = computed(() => buildMenuItems(router.getRoutes(), userStore, tenantStore))
const breadcrumbItems = computed(() => route.matched
  .filter((record) => record.meta.title)
  .map((record) => ({
    label: String(record.meta.title),
    path: record.name ? router.resolve({ name: record.name }).fullPath : record.path,
  })))
const menuIcon = (name: string) => menuIconMap[name] ?? IconApps

const handleMenuSelect = (key: string | number) => router.push({ name: String(key) })

const toggleTheme = () => {
  appStore.toggleDarkMode()
  Message.info({ content: appStore.darkMode ? '已切换到深色模式' : '已切换到浅色模式' })
}
</script>

<template>
  <div class="h-screen overflow-hidden bg-[#f2f3f5]" :class="{ 'is-dark': appStore.darkMode }">
    <header class="flex h-14 items-center justify-between border-b border-[#e5e6eb] bg-white pr-7 pl-11 max-[760px]:px-4">
      <div class="flex items-center gap-2.5 text-base font-semibold tracking-[-0.2px] text-[#1d2129]">
        <span class="relative inline-block size-[22px] [&_i]:absolute [&_i]:size-[11px] [&_i]:rotate-45 [&_i]:rounded-sm [&_i:nth-child(1)]:top-[5px] [&_i:nth-child(1)]:left-0 [&_i:nth-child(1)]:bg-[#00c1a2] [&_i:nth-child(2)]:top-0 [&_i:nth-child(2)]:left-1.5 [&_i:nth-child(2)]:bg-[#1664ff] [&_i:nth-child(3)]:top-[5px] [&_i:nth-child(3)]:right-0 [&_i:nth-child(3)]:bg-[#24a8ff] [&_i:nth-child(4)]:bottom-0 [&_i:nth-child(4)]:left-1.5 [&_i:nth-child(4)]:bg-[#6158e8]" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>Arco Design Pro</span>
      </div>
      <div class="flex items-center gap-4 text-xs text-[#4e5969] max-[760px]:gap-[9px]">
        <a-badge dot :offset="[2, 2]"><a-button type="text" class="min-w-7 text-[#4e5969] hover:text-[#165dff]" aria-label="通知"><IconNotification /></a-button></a-badge>
        <a-link href="https://arco.design/vue" target="_blank" class="py-1 text-xs text-[#4e5969] hover:text-[#165dff] max-[760px]:hidden">文档中心</a-link>
        <a-button type="text" class="min-w-7 text-[#4e5969] hover:text-[#165dff]" aria-label="切换主题" @click="toggleTheme"><IconMoonFill /></a-button>
        <a-dropdown>
          <a-space class="cursor-pointer"><a-avatar :size="24" class="bg-[#4b6cb7] text-white"><IconUser /></a-avatar><span class="max-[760px]:hidden">王立群</span></a-space>
          <template #content><a-doption>个人资料</a-doption><a-doption>退出登录</a-doption></template>
        </a-dropdown>
      </div>
    </header>

    <a-layout class="h-[calc(100vh-56px)] min-h-0 overflow-hidden">
      <a-layout-sider hide-trigger class="relative !w-[200px] border-r border-[#e5e6eb] bg-white">
        <a-menu :selected-keys="[String(route.name ?? 'workbench')]" :auto-open-selected="true" class="bg-white px-2.5 py-2 [&_.arco-menu-inline-header]:my-px [&_.arco-menu-inline-header]:h-10 [&_.arco-menu-inline-header]:rounded-sm [&_.arco-menu-inline-header]:pl-3 [&_.arco-menu-inline-header]:text-[13px] [&_.arco-menu-inline-header]:text-[#4e5969] [&_.arco-menu-item]:my-px [&_.arco-menu-item]:h-10 [&_.arco-menu-item]:rounded-sm [&_.arco-menu-item]:pl-3 [&_.arco-menu-item]:text-[13px] [&_.arco-menu-item]:text-[#4e5969] [&_.arco-menu-item]:!bg-transparent [&_.arco-menu-item:hover]:text-[#165dff] [&_.arco-menu-item:before]:!bg-transparent [&_.arco-menu-item:before]:!opacity-0 [&_.arco-menu-selected]:font-semibold [&_.arco-menu-selected]:!text-[#165dff]" @menu-item-click="handleMenuSelect">
          <a-menu-item v-for="item in menuItems" :key="item.key">
            <template #icon><component :is="menuIcon(item.icon)" /></template>
            {{ item.label }}
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout class="min-h-0 min-w-0 overflow-hidden">
        <a-layout-content class="min-h-0 overflow-auto bg-[#f2f3f5]">
          <div class="flex min-h-[30px] items-center justify-start bg-transparent px-2">
            <a-breadcrumb>
              <a-breadcrumb-item
                v-for="(item, index) in breadcrumbItems"
                :key="item.path"
                :class="{ 'cursor-pointer hover:text-[#165dff]': index < breadcrumbItems.length - 1 }"
                @click="index < breadcrumbItems.length - 1 && router.push(item.path)"
              >
                {{ item.label }}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-button class="floating-settings" type="primary" shape="circle" aria-label="设置" @click="router.push({ name: 'enterprise-settings' })"><IconSettings /></a-button>
  </div>
</template>
