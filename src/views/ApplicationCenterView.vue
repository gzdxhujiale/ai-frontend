<script setup lang="ts">
import { computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconApps,
  IconArrowRight,
  IconBarChart,
  IconCheckCircle,
  IconClockCircle,
  IconEye,
  IconFilter,
  IconRobot,
  IconSearch,
  IconSettings,
  IconThunderbolt,
} from '@arco-design/web-vue/es/icon'

const activeCategory = ref('全部')
const searchText = ref('')
const activeTab = ref('installed')

const categories = [
  { label: '全部', count: 10 }, { label: '商品', count: 3 }, { label: '营销', count: 1 }, { label: '履约', count: 2 },
  { label: '客服', count: 1 }, { label: '财务', count: 2 }, { label: '人事', count: 1 }, { label: '经营管理', count: 2 },
]

const applications = [
  { name: '竞店上新监测', category: '商品', level: 'L2 场景应用', maturity: '已稳定运行', description: '自动监测目标竞店上新，完成聚合、分析并生成跟进建议。', trigger: '每天 08:00 自动运行', lastResult: '发现 12 个新款', success: 98.7, runs: 186, saved: '42.5 人天', cost: '¥326', automation: 92, accent: 'from-blue-500 to-cyan-500', icon: 'monitor' },
  { name: '商品资料补全', category: '商品', level: 'L2 场景应用', maturity: '已上线验证', description: '识别商品资料缺失字段，由 AI 自动补全并交由人工确认。', trigger: '商品创建后触发', lastResult: '完成 36 个商品', success: 96.4, runs: 423, saved: '28.2 人天', cost: '¥218', automation: 86, accent: 'from-violet-500 to-fuchsia-500', icon: 'ai' },
  { name: '自动调整库存货期', category: '履约', level: 'L2 场景应用', maturity: '内部试运行', description: '根据库存与履约规则自动生成调整建议，确认后回写业务系统。', trigger: '库存预警触发', lastResult: '处理 18 个 SKU', success: 93.2, runs: 98, saved: '16.8 人天', cost: '¥152', automation: 74, accent: 'from-amber-500 to-orange-500', icon: 'action' },
  { name: '客服 AI 质检', category: '客服', level: 'L2 场景应用', maturity: '已上线验证', description: '检测客服会话质量、识别风险，并自动创建需要复核的任务。', trigger: '会话结束后触发', lastResult: '质检 1,280 条会话', success: 94.7, runs: 1280, saved: '35.6 人天', cost: '¥486', automation: 95, accent: 'from-emerald-500 to-teal-500', icon: 'check' },
  { name: '财务自动对账', category: '财务', level: 'L2 场景应用', maturity: '正在开发', description: '聚合平台、银行和内部账单，识别差异并生成核对任务。', trigger: '每个工作日 18:00', lastResult: '等待首次试运行', success: 0, runs: 0, saved: '待验证', cost: '待验证', automation: 0, accent: 'from-slate-500 to-slate-700', icon: 'data' },
  { name: '打版执行系统', category: '商品', level: 'L3 执行系统', maturity: '内部试运行', description: '承载版单、物料、纸样、车版、工艺、审核和结果验收全流程。', trigger: '创建版单实例', lastResult: '运行 24 个版单', success: 91.8, runs: 24, saved: '18.4 人天', cost: '¥198', automation: 68, accent: 'from-indigo-500 to-blue-700', icon: 'system' },
]

const filteredApps = computed(() => applications.filter((app) => {
  const matchesCategory = activeCategory.value === '全部' || app.category === activeCategory.value
  const matchesSearch = !searchText.value || `${app.name}${app.description}${app.category}`.toLowerCase().includes(searchText.value.toLowerCase())
  return matchesCategory && matchesSearch
}))

const maturityColor: Record<string, string> = { '已稳定运行': 'green', '已上线验证': 'arcoblue', '内部试运行': 'orange', '正在开发': 'gray' }
const handleAction = (label: string) => Message.info(`${label}已进入交互演示`)
</script>

<template>
  <div class="min-h-full bg-[#f5f7fa] px-4 pb-10 pt-2 sm:px-5 lg:px-6">
    <div class="mx-auto max-w-[1500px]">
      <header class="mb-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div class="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div><div class="mb-1 flex items-center gap-2"><h1 class="text-[22px] font-semibold tracking-[-0.02em] text-slate-900">应用中心</h1><a-tag color="green">企业经营能力</a-tag></div><p class="text-sm text-slate-500">查看企业已经拥有、正在运行并持续产生价值的经营应用</p></div>
          <div class="flex flex-wrap gap-2"><a-button @click="handleAction('查看运行监控')"><template #icon><IconEye /></template>运行监控</a-button><a-button type="primary" @click="handleAction('安装应用')"><template #icon><IconApps /></template>安装应用</a-button></div>
        </div>
        <div class="grid grid-cols-2 border-t border-slate-100 md:grid-cols-4">
          <div v-for="item in [{ label: '已安装应用', value: '10' }, { label: '今日运行', value: '1,846' }, { label: '本月节省', value: '141.5 人天' }, { label: '综合成功率', value: '96.8%' }]" :key="item.label" class="border-r border-slate-100 px-5 py-4 last:border-r-0"><span class="text-xs text-slate-400">{{ item.label }}</span><strong class="mt-1 block text-xl font-semibold text-slate-900">{{ item.value }}</strong></div>
        </div>
      </header>

      <section class="mb-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex gap-1 overflow-x-auto pb-1 lg:pb-0">
            <button v-for="category in categories" :key="category.label" type="button" class="shrink-0 rounded-lg px-3 py-2 text-sm transition" :class="activeCategory === category.label ? 'bg-blue-50 font-medium text-[#165dff]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'" @click="activeCategory = category.label">{{ category.label }} <span class="ml-1 text-xs opacity-60">{{ category.count }}</span></button>
          </div>
          <a-input v-model="searchText" allow-clear placeholder="搜索应用或经营问题" class="w-full lg:max-w-[300px]"><template #prefix><IconSearch /></template></a-input>
        </div>
      </section>

      <div class="mb-4 flex items-center justify-between"><div class="flex items-center gap-2 text-sm text-slate-600"><IconFilter />{{ activeCategory }} · {{ filteredApps.length }} 个应用</div><a-radio-group v-model="activeTab" type="button" size="small"><a-radio value="installed">已安装</a-radio><a-radio value="available">可安装</a-radio></a-radio-group></div>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="app in filteredApps" :key="app.name" class="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
          <div class="h-1.5 bg-gradient-to-r" :class="app.accent" />
          <div class="p-5">
            <div class="mb-4 flex items-start justify-between gap-3">
              <div class="flex min-w-0 gap-3"><span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl text-[#165dff]"><IconRobot v-if="app.icon === 'ai'" /><IconCheckCircle v-else-if="app.icon === 'check'" /><IconThunderbolt v-else-if="app.icon === 'action'" /><IconBarChart v-else /></span><div class="min-w-0"><h2 class="truncate text-base font-semibold text-slate-900">{{ app.name }}</h2><div class="mt-1 flex flex-wrap gap-1.5"><a-tag size="small">{{ app.level }}</a-tag><a-tag :color="maturityColor[app.maturity]" size="small">{{ app.maturity }}</a-tag></div></div></div>
              <a-button type="text" size="mini" @click="handleAction('应用配置')"><IconSettings /></a-button>
            </div>
            <p class="min-h-12 text-sm leading-6 text-slate-500">{{ app.description }}</p>
            <div class="mt-4 rounded-xl bg-slate-50 p-3"><div class="flex items-center justify-between gap-3 text-xs"><span class="flex items-center gap-1.5 text-slate-500"><IconClockCircle />{{ app.trigger }}</span><span class="font-medium text-slate-800">{{ app.lastResult }}</span></div></div>
            <div class="mt-4 grid grid-cols-3 gap-2 text-center"><div><strong class="block text-sm text-slate-900">{{ app.success ? `${app.success}%` : '--' }}</strong><span class="text-[11px] text-slate-400">成功率</span></div><div class="border-x border-slate-100"><strong class="block text-sm text-slate-900">{{ app.saved }}</strong><span class="text-[11px] text-slate-400">累计节省</span></div><div><strong class="block text-sm text-slate-900">{{ app.cost }}</strong><span class="text-[11px] text-slate-400">运行成本</span></div></div>
            <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4"><span class="text-xs text-slate-400">自动完成率 {{ app.automation ? `${app.automation}%` : '待验证' }}</span><a-link @click="handleAction('查看应用详情')">查看详情 <IconArrowRight /></a-link></div>
          </div>
        </article>
        <a-empty v-if="filteredApps.length === 0" class="col-span-full rounded-2xl border border-slate-200 bg-white py-16" description="没有符合条件的应用" />
      </section>

      <section class="mt-4 grid gap-4 lg:grid-cols-3">
        <div class="rounded-xl border border-blue-100 bg-blue-50/70 p-4"><div class="flex items-center gap-2 text-sm font-semibold text-blue-900"><IconThunderbolt />L1 原子能力</div><p class="mt-2 text-xs leading-5 text-blue-800/70">获取、处理、判断、生成、执行、协同和输出等底层动作，主要供系统与 AI 调用。</p></div>
        <div class="rounded-xl border border-violet-100 bg-violet-50/70 p-4"><div class="flex items-center gap-2 text-sm font-semibold text-violet-900"><IconRobot />L2 场景应用</div><p class="mt-2 text-xs leading-5 text-violet-800/70">围绕一个明确经营问题组合能力，自动运行，需要人时进入任务。</p></div>
        <div class="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4"><div class="flex items-center gap-2 text-sm font-semibold text-emerald-900"><IconApps />L3 执行系统</div><p class="mt-2 text-xs leading-5 text-emerald-800/70">长期承载多对象、多角色、多步骤和多状态的复杂业务运行。</p></div>
      </section>
    </div>
  </div>
</template>
