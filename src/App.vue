<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconApps,
  IconMoonFill,
  IconNotification,
  IconRobot,
  IconSend,
  IconSettings,
  IconUser,
} from '@arco-design/web-vue/es/icon'
import { menuIconMap } from './config/routes'
import { useAppStore } from './stores/app'
import type { DemoRole } from './stores/app'
import { useTenantStore } from './stores/tenant'
import { useUserStore } from './stores/user'
import { buildMenuItems } from './utils/permission'

interface AiMessage {
  id: number
  role: 'assistant' | 'user'
  content: string
}

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const tenantStore = useTenantStore()
const userStore = useUserStore()
const aiDrawerVisible = ref(false)
const aiQuestion = ref('')
const aiSending = ref(false)
const aiMessages = ref<AiMessage[]>([
  { id: 1, role: 'assistant', content: '你好，我是企业 AI。我可以结合当前页面、任务、经营指标和企业知识，帮你查询情况、分析异常或准备下一步行动。' },
])

const menuItems = computed(() => buildMenuItems(router.getRoutes(), userStore, tenantStore))
const menuIcon = (name: string) => menuIconMap[name] ?? IconApps

const handleMenuSelect = (key: string | number) => router.push({ name: String(key) })

const toggleTheme = () => {
  appStore.toggleDarkMode()
  Message.info({ content: appStore.darkMode ? '已切换到深色模式' : '已切换到浅色模式' })
}

const demoRoleLabels: Record<DemoRole, string> = {
  operator: '经营者',
  manager: '管理者',
  employee: '一线员工',
}

const switchDemoRole = (role: DemoRole) => {
  appStore.setDemoRole(role)
  Message.success({ content: `已切换为${demoRoleLabels[role]}视角` })
}

const quickQuestions = ['今天有哪些重点异常？', '我的待办中什么最紧急？', '分析库存周转变慢的原因']

const sendAiQuestion = async (question = aiQuestion.value) => {
  const content = question.trim()
  if (!content || aiSending.value) return
  aiMessages.value.push({ id: Date.now(), role: 'user', content })
  aiQuestion.value = ''
  aiSending.value = true
  await nextTick()
  window.setTimeout(() => {
    aiMessages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: '我已收到这个问题。正式接入后，我会基于你的角色权限读取相关经营事实，并在回答中标明数据来源；涉及创建任务或修改业务数据时，会先请你确认。',
    })
    aiSending.value = false
  }, 650)
}

const handleAiKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    void sendAiQuestion()
  }
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
        <a-button type="primary" shape="round" class="!h-8 !px-3.5 shadow-sm" aria-label="问企业 AI" @click="aiDrawerVisible = true"><template #icon><IconRobot /></template><span class="max-[560px]:hidden">问 AI</span></a-button>
        <a-badge dot :offset="[2, 2]"><a-button type="text" class="min-w-7 text-[#4e5969] hover:text-[#165dff]" aria-label="通知"><IconNotification /></a-button></a-badge>
        <a-link href="https://arco.design/vue" target="_blank" class="py-1 text-xs text-[#4e5969] hover:text-[#165dff] max-[760px]:hidden">文档中心</a-link>
        <a-button type="text" class="min-w-7 text-[#4e5969] hover:text-[#165dff]" aria-label="切换主题" @click="toggleTheme"><IconMoonFill /></a-button>
        <a-dropdown>
          <a-space class="cursor-pointer"><a-avatar :size="24" class="bg-[#4b6cb7] text-white"><IconUser /></a-avatar><span class="max-[760px]:hidden">王立群</span><span class="rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] text-[#165dff] max-[900px]:hidden">{{ demoRoleLabels[appStore.demoRole] }}</span></a-space>
          <template #content>
            <a-doption disabled class="!text-xs !text-[#86909c]">演示角色</a-doption>
            <a-doption v-for="(label, role) in demoRoleLabels" :key="role" @click="switchDemoRole(role)">
              <span class="flex min-w-28 items-center justify-between gap-4"><span>{{ label }}</span><span v-if="appStore.demoRole === role" class="font-semibold text-[#165dff]">✓</span></span>
            </a-doption>
            <a-divider class="!my-1" />
            <a-doption>个人资料</a-doption><a-doption>退出登录</a-doption>
          </template>
        </a-dropdown>
      </div>
    </header>

    <a-layout class="h-[calc(100vh-56px)] min-h-0 overflow-hidden">
      <a-layout-sider hide-trigger class="relative !w-[200px] border-r border-[#e5e6eb] bg-white">
        <a-menu :selected-keys="[String(route.name ?? 'workbench')]" :auto-open-selected="true" class="bg-white px-2.5 py-3 [&_.arco-menu-icon]:mr-3 [&_.arco-menu-icon]:text-[18px] [&_.arco-menu-inline-header]:my-1 [&_.arco-menu-inline-header]:h-12 [&_.arco-menu-inline-header]:rounded-lg [&_.arco-menu-inline-header]:pl-3.5 [&_.arco-menu-inline-header]:text-sm [&_.arco-menu-inline-header]:text-[#4e5969] [&_.arco-menu-item]:my-1 [&_.arco-menu-item]:h-12 [&_.arco-menu-item]:rounded-lg [&_.arco-menu-item]:pl-3.5 [&_.arco-menu-item]:text-sm [&_.arco-menu-item]:text-[#4e5969] [&_.arco-menu-item]:!bg-transparent [&_.arco-menu-item:hover]:text-[#165dff] [&_.arco-menu-item:before]:!bg-transparent [&_.arco-menu-item:before]:!opacity-0 [&_.arco-menu-selected]:font-semibold [&_.arco-menu-selected]:!text-[#165dff]" @menu-item-click="handleMenuSelect">
          <a-menu-item v-for="item in menuItems" :key="item.key">
            <template #icon><component :is="menuIcon(item.icon)" /></template>
            {{ item.label }}
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout class="min-h-0 min-w-0 overflow-hidden">
        <a-layout-content class="min-h-0 overflow-auto bg-[#f2f3f5]">
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-button class="floating-settings" type="primary" shape="circle" aria-label="设置" @click="router.push({ name: 'enterprise-settings' })"><IconSettings /></a-button>

    <a-drawer v-model:visible="aiDrawerVisible" :width="420" :footer="false" :mask-closable="true" unmount-on-close>
      <template #title>
        <div class="flex items-center gap-3">
          <span class="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#165dff] to-[#7b61ff] text-white shadow-sm"><IconRobot /></span>
          <div><div class="text-sm font-semibold text-slate-900">企业 AI</div><div class="mt-0.5 flex items-center gap-1.5 text-[11px] font-normal text-emerald-600"><span class="size-1.5 rounded-full bg-emerald-500" />已连接企业经营上下文</div></div>
        </div>
      </template>

      <div class="flex h-[calc(100vh-112px)] min-h-0 flex-col">
        <div class="border-b border-slate-100 px-1 pb-4">
          <p class="mb-2 text-xs text-slate-400">你可以这样问</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="question in quickQuestions" :key="question" type="button" class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#165dff]" @click="sendAiQuestion(question)">{{ question }}</button>
          </div>
        </div>

        <div class="min-h-0 flex-1 space-y-4 overflow-y-auto py-5 pr-1">
          <div v-for="message in aiMessages" :key="message.id" class="flex gap-2.5" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
            <span v-if="message.role === 'assistant'" class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#165dff]"><IconRobot /></span>
            <div class="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-6" :class="message.role === 'user' ? 'rounded-br-md bg-[#165dff] text-white' : 'rounded-tl-md bg-slate-100 text-slate-700'">{{ message.content }}</div>
          </div>
          <div v-if="aiSending" class="flex items-center gap-2.5"><span class="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-[#165dff]"><IconRobot /></span><span class="rounded-2xl rounded-tl-md bg-slate-100 px-3.5 py-2.5 text-xs text-slate-400">正在结合企业上下文思考…</span></div>
        </div>

        <div class="border-t border-slate-100 pt-4">
          <div class="rounded-xl border border-slate-200 bg-white p-2 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <a-textarea v-model="aiQuestion" :auto-size="{ minRows: 2, maxRows: 5 }" :max-length="1000" placeholder="询问经营情况、任务、指标或企业知识…" class="!border-0 !bg-transparent !shadow-none" @keydown="handleAiKeydown" />
            <div class="mt-1 flex items-center justify-between px-1"><span class="text-[11px] text-slate-400">Enter 发送 · Shift + Enter 换行</span><a-button type="primary" shape="circle" size="small" :disabled="!aiQuestion.trim()" :loading="aiSending" aria-label="发送问题" @click="sendAiQuestion()"><IconSend /></a-button></div>
          </div>
          <p class="mt-2 text-center text-[11px] text-slate-400">AI 回答可能有误，重要业务操作将要求人工确认</p>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
