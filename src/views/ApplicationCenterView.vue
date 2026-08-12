<script setup lang="ts">
import { computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconArrowRight,
  IconBarChart,
  IconClockCircle,
  IconDownload,
  IconPlus,
  IconPublic,
  IconRefresh,
  IconRobot,
  IconSearch,
  IconSettings,
  IconSound,
  IconTag,
} from '@arco-design/web-vue/es/icon'
import AppCreateModal from '../components/apps/AppCreateModal.vue'
import AppDetailModal from '../components/apps/AppDetailModal.vue'
import AppInteractiveDialogModal from '../components/apps/AppInteractiveDialogModal.vue'
import { useAppCenterStore } from '../stores/appCenter'
import type { AppItem, AppSpace } from '../stores/appCenter'
import { useTenantStore } from '../stores/tenant'

const appStore = useAppCenterStore()
const tenantStore = useTenantStore()

const activeSpace = ref<AppSpace>('all')
const activeCategory = ref('全部')
const filterStatus = ref<'all' | 'installed' | 'available'>('all')
const searchText = ref('')

const interactiveModalVisible = ref(false)
const interactiveApp = ref<AppItem | null>(null)

const categories = [
  { label: '全部' },
  { label: '淘宝' },
  { label: '亚马逊' },
  { label: '跨境' },
  { label: '财务' },
  { label: '客服' },
  { label: '人事' },
  { label: '商品' },
  { label: '营销' },
]

const spaces = [
  { key: 'all', label: '全部' },
  { key: 'personal', label: '个人空间' },
  { key: 'public', label: '公共空间' },
  { key: 'rnd', label: '研发中心' },
  { key: 'jv', label: '合资企业' },
]

const filteredApps = computed(() => {
  return appStore.apps.filter((app) => {
    // Space filter
    const matchesSpace = activeSpace.value === 'all' || app.space === activeSpace.value

    // Category filter
    const matchesCategory = activeCategory.value === '全部' || app.category === activeCategory.value

    // Status filter
    const matchesStatus =
      filterStatus.value === 'all' ||
      (filterStatus.value === 'installed' && app.isInstalled) ||
      (filterStatus.value === 'available' && !app.isInstalled)

    // Search filter
    const search = searchText.value.trim().toLowerCase()
    const matchesSearch =
      !search ||
      `${app.name} ${app.description} ${app.category} ${app.tags.join(' ')} ${app.developer}`
        .toLowerCase()
        .includes(search)

    return matchesSpace && matchesCategory && matchesStatus && matchesSearch
  })
})

const maturityColor: Record<string, string> = {
  'L1 原子能力': 'orange',
  'L2 场景应用': 'arcoblue',
  'L3 执行系统': 'green',
}

const handleOpenInteractive = (app: AppItem) => {
  if (!app.isInstalled) {
    Message.info({ content: `请先点击“获取”安装应用 [${app.name}]` })
    return
  }
  interactiveApp.value = app
  interactiveModalVisible.value = true
}

const handleToggleInstall = (app: AppItem) => {
  appStore.toggleInstall(app.id)
  Message.success({
    content: app.isInstalled ? `已成功获取 [${app.name}]！` : `已卸载 [${app.name}]`,
  })
}

const handleOpenDetail = (appId: string, tab = 'overview') => {
  appStore.openDetail(appId, tab)
}

const handleCreateApp = () => {
  appStore.createModalVisible = true
}

const handleRefresh = () => {
  Message.success({ content: '应用状态与最新数据已同步刷新' })
}
</script>

<template>
  <div class="min-h-full bg-[#f5f7fa] px-4 pb-10 pt-4 sm:px-5 lg:px-6">
    <div class="mx-auto max-w-[1500px] space-y-4">
      <!-- 1. Header Banner & Tenant Integration -->
      <header class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div class="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="mb-1 flex items-center gap-2.5">
              <h1 class="text-xl font-bold tracking-tight text-slate-900">企业应用中心</h1>
              <a-tag color="blue" size="small">{{ tenantStore.currentTenant.name }}</a-tag>
              <a-tag color="green" size="small">影刀 & 飞书竞品体验版</a-tag>
            </div>
            <p class="text-xs text-slate-500">
              整合 RPA 自动化流程、AI Agent、场景工具与空间权限映射，驱动企业高效经营
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <a-button class="!rounded-lg" @click="handleRefresh">
              <template #icon><IconRefresh /></template>
              刷新数据
            </a-button>

            <a-button type="primary" class="!rounded-lg !bg-blue-600 hover:!bg-blue-700" @click="handleCreateApp">
              <template #icon><IconPlus /></template>
              创建应用
            </a-button>
          </div>
        </div>

        <!-- Dashboard Stats Grid -->
        <div class="grid grid-cols-2 border-t border-slate-100 md:grid-cols-4">
          <div class="border-r border-slate-100 px-5 py-3.5">
            <span class="text-xs text-slate-400 block">已安装应用</span>
            <strong class="mt-0.5 block text-lg font-bold text-slate-900">{{ appStore.installedAppsCount }} 个</strong>
          </div>
          <div class="border-r border-slate-100 px-5 py-3.5">
            <span class="text-xs text-slate-400 block">正在运行实例</span>
            <strong class="mt-0.5 block text-lg font-bold text-emerald-600">{{ appStore.activeRunningAppsCount }} 个</strong>
          </div>
          <div class="border-r border-slate-100 px-5 py-3.5">
            <span class="text-xs text-slate-400 block">累计节省工时</span>
            <strong class="mt-0.5 block text-lg font-bold text-slate-900">{{ appStore.totalSavedPersonDays }} 人天</strong>
          </div>
          <div class="px-5 py-3.5">
            <span class="text-xs text-slate-400 block">平均成功率</span>
            <strong class="mt-0.5 block text-lg font-bold text-slate-900">98.6%</strong>
          </div>
        </div>
      </header>

      <!-- 2. Space Selector Tabs (Feishu Style) -->
      <div class="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-xs">
        <div class="flex items-center gap-1">
          <span class="text-xs font-semibold text-slate-400 mr-2">空间维度:</span>
          <button
            v-for="space in spaces"
            :key="space.key"
            type="button"
            class="rounded-lg px-3.5 py-1.5 text-xs font-medium transition"
            :class="
              activeSpace === space.key
                ? 'bg-blue-50 text-[#165dff] font-bold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            "
            @click="activeSpace = space.key as AppSpace"
          >
            {{ space.label }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <a-radio-group v-model="filterStatus" type="button" size="small">
            <a-radio value="all">全部应用</a-radio>
            <a-radio value="installed">已安装</a-radio>
            <a-radio value="available">可获取</a-radio>
          </a-radio-group>
        </div>
      </div>

      <!-- 3. Category Filter & Search Bar (ShadowBot Style) -->
      <section class="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap gap-1 overflow-x-auto">
            <button
              v-for="category in categories"
              :key="category.label"
              type="button"
              class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition"
              :class="
                activeCategory === category.label
                  ? 'bg-blue-50 text-[#165dff] font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              "
              @click="activeCategory = category.label"
            >
              {{ category.label }}
            </button>
          </div>

          <a-input
            v-model="searchText"
            allow-clear
            placeholder="搜索影刀 RPA、Agent 或应用名称..."
            class="w-full lg:max-w-[320px] !rounded-lg"
          >
            <template #prefix><IconSearch /></template>
          </a-input>
        </div>
      </section>

      <!-- 4. Applications Grid List -->
      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="app in filteredApps"
          :key="app.id"
          class="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md flex flex-col justify-between"
        >
          <!-- Top Decorative Bar -->
          <div>
            <div class="h-1 bg-gradient-to-r" :class="app.accent" />

            <div class="p-5">
              <!-- Header Row -->
              <div class="mb-3 flex items-start justify-between gap-3">
                <div class="flex min-w-0 gap-3">
                  <span
                    class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl text-[#165dff]"
                  >
                    <IconRobot v-if="app.icon === 'ai'" />
                    <IconTag v-else-if="app.icon === 'shopping'" />
                    <IconPublic v-else-if="app.icon === 'global'" />
                    <IconSound v-else-if="app.icon === 'sound'" />
                    <IconBarChart v-else />
                  </span>

                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <h2 class="truncate text-base font-bold text-slate-900 group-hover:text-[#165dff] transition">
                        {{ app.name }}
                      </h2>
                      <a-tag v-if="app.isOfficial" color="red" size="small">官方</a-tag>
                    </div>

                    <div class="mt-1 flex flex-wrap gap-1">
                      <a-tag size="small" :color="maturityColor[app.level]">{{ app.level }}</a-tag>
                      <a-tag size="small" color="purple">{{ app.category }}</a-tag>
                    </div>
                  </div>
                </div>

                <a-button
                  type="text"
                  size="small"
                  class="!text-slate-400 hover:!text-slate-700"
                  @click="handleOpenDetail(app.id, 'config')"
                >
                  <IconSettings />
                </a-button>
              </div>

              <!-- Description -->
              <p class="min-h-11 text-xs leading-5 text-slate-500 line-clamp-2">
                {{ app.description }}
              </p>

              <!-- Trigger / Last Result Card -->
              <div class="mt-3 rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                <div class="flex items-center justify-between gap-2 text-xs">
                  <span class="flex items-center gap-1 text-slate-500 truncate">
                    <IconClockCircle class="shrink-0" />
                    {{ app.triggers[0]?.config || '未设置触发机制' }}
                  </span>
                  <span class="font-medium text-slate-700 shrink-0">{{ app.lastRunResult }}</span>
                </div>
              </div>

              <!-- Stats Metrics -->
              <div class="mt-3 grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
                <div>
                  <strong class="block text-xs font-bold text-slate-900">{{ app.successRate }}%</strong>
                  <span class="text-[10px] text-slate-400">成功率</span>
                </div>
                <div class="border-x border-slate-100">
                  <strong class="block text-xs font-bold text-slate-900">{{ app.savedPersonDays }}</strong>
                  <span class="text-[10px] text-slate-400">节省工时</span>
                </div>
                <div>
                  <strong class="block text-xs font-bold text-slate-900">{{ app.costSaved }}</strong>
                  <span class="text-[10px] text-slate-400">节省成本</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Footer Action Bar -->
          <div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">
            <div class="flex items-center gap-2">
              <a-button
                v-if="!app.isInstalled"
                type="primary"
                size="small"
                class="!rounded-lg !bg-rose-500 hover:!bg-rose-600 !px-4"
                @click="handleToggleInstall(app)"
              >
                <template #icon><IconDownload /></template>
                获取
              </a-button>

              <a-button
                v-else
                type="primary"
                size="small"
                class="!rounded-lg !bg-emerald-600 hover:!bg-emerald-700 !px-3"
                @click="handleOpenInteractive(app)"
              >
                交互框 (运行)
              </a-button>

              <span class="text-[11px] text-slate-400">
                {{ app.isInstalled ? '已在当前租户上线' : '尚未安装' }}
              </span>
            </div>

            <a-link class="!text-xs" @click="handleOpenDetail(app.id, 'overview')">
              查看详情 <IconArrowRight />
            </a-link>
          </div>
        </article>

        <!-- Empty state -->
        <a-empty
          v-if="filteredApps.length === 0"
          class="col-span-full rounded-2xl border border-slate-200 bg-white py-16"
          description="没有符合条件的应用，可尝试切换筛选维度或在顶部创建新应用"
        />
      </section>

      <!-- 5. Modals & Drawers -->
      <AppCreateModal v-model:visible="appStore.createModalVisible" />
      <AppDetailModal v-model:visible="appStore.detailModalVisible" />
      <AppInteractiveDialogModal
        v-model:visible="interactiveModalVisible"
        :app="interactiveApp"
      />
    </div>
  </div>
</template>
