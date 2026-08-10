<script setup lang="ts">
import { computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconApps,
  IconLanguage,
  IconMenuFold,
  IconMenuUnfold,
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
const pageTitle = computed(() => String(route.meta.title ?? '工作台'))
const menuIcon = (name: string) => menuIconMap[name] ?? IconApps

const handleMenuSelect = (key: string | number) => router.push({ name: String(key) })

const switchTenant = (tenantId: string) => {
  tenantStore.switchTenant(tenantId)
  Message.success({ content: `已切换到 ${tenantStore.currentTenant.name}` })
  if (route.name !== 'workbench') router.push({ name: 'workbench' })
}

const toggleLanguage = () => {
  appStore.toggleLanguage()
  Message.success({ content: `已切换至 ${appStore.language}` })
}

const toggleTheme = () => {
  appStore.toggleDarkMode()
  Message.info({ content: appStore.darkMode ? '已切换到深色模式' : '已切换到浅色模式' })
}
</script>

<template>
  <div class="pro-app" :class="{ 'is-dark': appStore.darkMode }">
    <header class="pro-header">
      <div class="pro-brand">
        <span class="pro-logo" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>Arco Design Pro</span>
      </div>
      <div class="pro-header-tools">
        <a-badge dot :offset="[2, 2]"><a-button type="text" class="tool-button" aria-label="通知"><IconNotification /></a-button></a-badge>
        <a-link href="https://arco.design/vue" target="_blank" class="header-link">文档中心</a-link>
        <a-button type="text" class="header-link" @click="toggleLanguage"><template #icon><IconLanguage /></template>{{ appStore.language }}<span class="caret">⌄</span></a-button>
        <a-button type="text" class="tool-button" aria-label="切换主题" @click="toggleTheme"><IconMoonFill /></a-button>
        <a-dropdown>
          <a-space class="tenant-trigger">
            <span class="tenant-dot" :style="{ backgroundColor: tenantStore.currentTenant.color }" />
            <span class="tenant-name">{{ tenantStore.currentTenant.name }}</span>
            <span class="tenant-plan">{{ tenantStore.currentTenant.plan }}</span>
            <span class="caret">⌄</span>
          </a-space>
          <template #content>
            <a-dgroup title="切换租户">
              <a-doption v-for="tenant in tenantStore.tenants" :key="tenant.id" @click="switchTenant(tenant.id)">
                <span class="tenant-option"><i :style="{ backgroundColor: tenant.color }" />{{ tenant.name }}<small>{{ tenant.plan }}</small></span>
              </a-doption>
            </a-dgroup>
          </template>
        </a-dropdown>
        <a-dropdown>
          <a-space class="user-trigger"><a-avatar :size="24" class="user-avatar"><IconUser /></a-avatar><span>王立群</span></a-space>
          <template #content><a-doption>个人资料</a-doption><a-doption>退出登录</a-doption></template>
        </a-dropdown>
      </div>
    </header>

    <a-layout class="pro-body">
      <a-layout-sider v-model:collapsed="appStore.collapsed" :width="210" :collapsed-width="64" hide-trigger class="pro-sider">
        <a-menu :selected-keys="[String(route.name ?? 'workbench')]" :auto-open-selected="true" class="pro-menu" @menu-item-click="handleMenuSelect">
          <a-menu-item v-for="item in menuItems" :key="item.key">
            <template #icon><component :is="menuIcon(item.icon)" /></template>
            {{ item.label }}
          </a-menu-item>
        </a-menu>
        <div class="sider-collapse"><a-button type="text" @click="appStore.toggleCollapsed"><template #icon><IconMenuUnfold v-if="appStore.collapsed" /><IconMenuFold v-else /></template><span v-if="!appStore.collapsed">收起菜单</span></a-button></div>
      </a-layout-sider>

      <a-layout class="pro-main">
        <a-layout-header class="welcome-header">
          <div><h1>{{ pageTitle === '我的工作台' ? '欢迎!' : pageTitle }}</h1><p>王立群，wangliqun@email.com · 当前租户：{{ tenantStore.currentTenant.name }}</p></div>
          <div class="account-metrics"><div><span>余额（元）</span><strong>⌂ 392.52</strong></div><div><span>待支付</span><strong>⌂ 0.00</strong></div><div><span>待续费订单</span><strong>⌂ 1</strong></div></div>
        </a-layout-header>
        <a-layout-content class="pro-content"><RouterView /></a-layout-content>
      </a-layout>
    </a-layout>
    <a-button class="floating-settings" type="primary" shape="circle" aria-label="设置" @click="router.push({ name: 'enterprise-settings' })"><IconSettings /></a-button>
  </div>
</template>
