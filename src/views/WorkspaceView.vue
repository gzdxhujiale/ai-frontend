<script setup lang="ts">
import { computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useAppStore } from '../stores/app'
import {
  IconArrowRight,
  IconCheckCircle,
  IconClockCircle,
  IconExclamationCircle,
  IconFire,
  IconMore,
  IconRefresh,
  IconRobot,
  IconThunderbolt,
} from '@arco-design/web-vue/es/icon'

type RoleKey = 'operator' | 'manager' | 'employee'

interface RoleOption {
  key: RoleKey
  label: string
  title: string
  subtitle: string
}

const appStore = useAppStore()
const activeRole = computed(() => appStore.demoRole)
const summaryUpdatedAt = ref('08:36')
const summaryRefreshing = ref(false)

const roles: RoleOption[] = [
  { key: 'operator', label: '经营者', title: '王总，早上好', subtitle: '5 分钟看清经营结果、异常和决策点' },
  { key: 'manager', label: '管理者', title: '王经理，早上好', subtitle: '聚焦团队进度、异常、资源与结果' },
  { key: 'employee', label: '一线员工', title: '王立群，早上好', subtitle: '先完成今天最重要的业务动作' },
]

const currentRole = computed(() => roles.find((role) => role.key === activeRole.value) ?? roles[0])

const roleData = {
  operator: {
    status: '整体经营平稳，2 项指标需要关注',
    summary: '昨日销售额完成日目标的 108%，毛利率保持稳定。华东仓 3 个重点款库存低于安全线，可能影响本周大促；打版项目有 2 个节点发生阻断。建议今天优先确认补货方案，并协调设计与版房资源。',
    summaryTags: ['销售达标', '毛利稳定', '库存风险'],
    metrics: [
      { label: '昨日销售额', value: '286.4万', change: '+12.6%', note: '目标完成 108%', tone: 'good' },
      { label: '综合毛利率', value: '47.8%', change: '+1.2%', note: '较上周同期', tone: 'good' },
      { label: '库存周转天数', value: '41.6天', change: '+4.3天', note: '高于目标 3.6 天', tone: 'risk' },
      { label: '订单准时履约率', value: '96.2%', change: '-0.8%', note: '目标 97%', tone: 'warn' },
    ],
  },
  manager: {
    status: '团队执行正常，3 项任务存在延期风险',
    summary: '商品部今日共有 28 项进行中任务，整体按期率 91%。2 个打版任务因物料未到发生阻断，1 个商品资料任务将在 4 小时后超时。建议先协调采购确认到料时间，再处理待验收的 6 项成果。',
    summaryTags: ['按期率 91%', '2 项阻断', '6 项待验收'],
    metrics: [
      { label: '部门目标达成', value: '84%', change: '+6%', note: '本月进度', tone: 'good' },
      { label: '进行中任务', value: '28项', change: '3 项风险', note: '覆盖 12 人', tone: 'warn' },
      { label: '任务按期率', value: '91%', change: '-2.1%', note: '较上周', tone: 'warn' },
      { label: '待验收', value: '6项', change: '2 项今天到期', note: '需要你处理', tone: 'risk' },
    ],
  },
  employee: {
    status: '今天有 5 项任务，1 项需要优先处理',
    summary: 'AI 已为你整理好款号 A102 的版单资料、物料状态和历史修改记录。你需要在 11:30 前确认水洗效果并提交审核结果。完成后，下游“车版确认”任务会自动开始。',
    summaryTags: ['5 项任务', 'AI 已预处理', '11:30 前完成'],
    metrics: [
      { label: '今天的任务', value: '5项', change: '1 项紧急', note: '预计 3.5 小时', tone: 'warn' },
      { label: 'AI 已预处理', value: '3项', change: '节省 42 分钟', note: '资料与校验', tone: 'good' },
      { label: '本周按时完成', value: '96%', change: '+4%', note: '共完成 24 项', tone: 'good' },
      { label: '待反馈异常', value: '1项', change: '物料色差', note: '等待补充照片', tone: 'risk' },
    ],
  },
} satisfies Record<RoleKey, { status: string; summary: string; summaryTags: string[]; metrics: Array<{ label: string; value: string; change: string; note: string; tone: string }> }>

const currentData = computed(() => roleData[activeRole.value])

const actionItems = [
  { id: 1, type: '待决策', color: 'red', title: '华东仓重点款补货方案确认', context: '3 个重点款预计 5 天内低于安全库存', time: '今天 10:30 前', owner: '供应链中心', action: '去决策' },
  { id: 2, type: '阻断', color: 'orange', title: '秋款 A102 打版节点阻断', context: '二次工艺物料未到，已影响后续 2 个任务', time: '已阻断 5 小时', owner: '商品中心', action: '处理异常' },
  { id: 3, type: '待验收', color: 'blue', title: '客服 AI 质检第一阶段验收', context: '已完成 1,280 条会话检测，准确率 94.7%', time: '今天到期', owner: '客户体验部', action: '去验收' },
  { id: 4, type: 'AI 确认', color: 'purple', title: '确认创建库存预警跟进任务', context: 'AI 建议为 3 个风险款分别创建负责人任务', time: '等待你确认', owner: '企业 AI', action: '查看建议' },
]

const projects = [
  { name: '打版执行系统', stage: '试运行', progress: 72, milestone: '完成首轮业务验收', date: '8月15日', risk: '2 项阻断' },
  { name: '客服 AI 质检', stage: '待验收', progress: 90, milestone: '业务准确率验收', date: '今天', risk: '正常' },
  { name: '经营语义与指标一期', stage: '建设中', progress: 46, milestone: '商品域指标注册', date: '8月22日', risk: '1 项风险' },
]

const aiActivities = [
  { icon: 'check', title: '完成竞店上新监测', description: '发现 12 个新款，已生成商品分析摘要', time: '08:31', tag: '已完成' },
  { icon: 'alert', title: '发现库存跌破安全线', description: '涉及 3 个重点款，预计影响销售额约 18 万', time: '08:18', tag: '需关注' },
  { icon: 'check', title: '完成客服会话质检', description: '检测 1,280 条会话，识别 26 条风险记录', time: '07:52', tag: '已完成' },
  { icon: 'wait', title: '等待创建跟进任务', description: '涉及业务写操作，需要你确认后执行', time: '07:48', tag: '待确认' },
]

const employeeTask = {
  title: '确认款号 A102 的二次工艺结果',
  deadline: '今天 11:30',
  aiDone: ['已读取并整理版单资料', '已核对 6 项物料状态', '已汇总 3 次历史修改记录'],
  userTodo: ['确认水洗效果是否符合要求', '上传一张清晰的效果照片', '选择“通过”或填写退回原因'],
}

const metricToneClass: Record<string, string> = {
  good: 'bg-emerald-50 text-emerald-700',
  warn: 'bg-amber-50 text-amber-700',
  risk: 'bg-red-50 text-red-700',
}

const refreshSummary = () => {
  summaryRefreshing.value = true
  window.setTimeout(() => {
    summaryUpdatedAt.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
    summaryRefreshing.value = false
    Message.success('AI 今日简报已更新')
  }, 700)
}

const handleAction = (label: string) => Message.info(`${label}功能将在对应业务页面中承载`)
</script>

<template>
  <div class="min-h-full bg-[#f5f7fa] px-4 pb-10 pt-2 sm:px-5 lg:px-6">
    <div class="mx-auto max-w-[1500px]">
      <section class="mb-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-6">
        <div>
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <h1 class="text-[22px] font-semibold tracking-[-0.02em] text-slate-900">{{ currentRole.title }}</h1>
            <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"><span class="size-1.5 rounded-full bg-emerald-500" />经营运行中</span>
          </div>
          <p class="text-sm text-slate-500">{{ currentRole.subtitle }} · 2026年8月10日 星期一</p>
          <div class="mt-3 flex items-center gap-2 text-sm text-slate-700"><IconThunderbolt class="text-[#165dff]" /><span>{{ currentData.status }}</span></div>
        </div>
      </section>

      <section class="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#183b7a] via-[#174d9b] to-[#1167c7] text-white shadow-[0_12px_30px_rgba(22,93,255,0.16)]">
        <div class="grid gap-6 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-7 lg:py-6">
          <div>
            <div class="mb-3 flex flex-wrap items-center gap-2">
              <span class="flex size-8 items-center justify-center rounded-lg bg-white/15"><IconRobot class="text-lg" /></span>
              <h2 class="text-base font-semibold">AI 今日经营简报</h2>
              <span class="text-xs text-blue-100">更新于 {{ summaryUpdatedAt }}</span>
            </div>
            <p class="max-w-5xl text-sm leading-7 text-blue-50">{{ currentData.summary }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="tag in currentData.summaryTags" :key="tag" class="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-blue-50">{{ tag }}</span>
            </div>
          </div>
          <div class="flex items-end gap-2 lg:flex-col lg:items-end lg:justify-between">
            <a-button type="outline" class="!border-white/30 !text-white hover:!bg-white/10" :loading="summaryRefreshing" @click="refreshSummary"><template #icon><IconRefresh /></template>刷新简报</a-button>
            <a-button type="text" class="!text-blue-100" @click="handleAction('查看简报依据')">查看数据依据 <IconArrowRight /></a-button>
          </div>
        </div>
      </section>

      <section class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <a-card v-for="metric in currentData.metrics" :key="metric.label" :bordered="false" class="!rounded-xl !border !border-slate-200/80 shadow-none transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <span class="text-sm text-slate-500">{{ metric.label }}</span>
            <span class="rounded-md px-2 py-0.5 text-xs font-medium" :class="metricToneClass[metric.tone]">{{ metric.change }}</span>
          </div>
          <div class="mt-4 text-[26px] font-semibold tracking-[-0.03em] text-slate-900">{{ metric.value }}</div>
          <div class="mt-1 text-xs text-slate-400">{{ metric.note }}</div>
        </a-card>
      </section>

      <template v-if="activeRole === 'employee'">
        <section class="mb-4 rounded-2xl border border-[#bed4ff] bg-white shadow-[0_6px_24px_rgba(22,93,255,0.08)]">
          <div class="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><div class="mb-1 flex items-center gap-2"><span class="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">最优先</span><span class="text-xs text-slate-400">{{ employeeTask.deadline }}</span></div><h2 class="text-base font-semibold text-slate-900">{{ employeeTask.title }}</h2></div>
            <a-button type="primary" @click="handleAction('开始处理')">开始处理 <IconArrowRight /></a-button>
          </div>
          <div class="grid gap-5 px-5 py-5 lg:grid-cols-2">
            <div class="rounded-xl bg-emerald-50/70 p-4"><div class="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800"><IconRobot />AI 已经完成</div><div v-for="item in employeeTask.aiDone" :key="item" class="mt-2 flex items-start gap-2 text-sm text-emerald-900"><IconCheckCircle class="mt-0.5 shrink-0 text-emerald-500" /><span>{{ item }}</span></div></div>
            <div class="rounded-xl bg-blue-50/70 p-4"><div class="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-800"><IconThunderbolt />你需要完成</div><div v-for="(item, index) in employeeTask.userTodo" :key="item" class="mt-2 flex items-start gap-2 text-sm text-blue-950"><span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-700">{{ index + 1 }}</span><span>{{ item }}</span></div></div>
          </div>
        </section>
      </template>

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.8fr)]">
        <div class="min-w-0 space-y-4">
          <a-card :bordered="false" class="!rounded-2xl !border !border-slate-200/80 shadow-none">
            <template #title><div class="flex items-center gap-2 text-[15px] font-semibold text-slate-900"><IconFire class="text-red-500" />需要我处理</div></template>
            <template #extra><a-link @click="handleAction('查看全部待办')">全部待办 <IconArrowRight /></a-link></template>
            <div class="divide-y divide-slate-100">
              <div v-for="item in actionItems" :key="item.id" class="group grid gap-3 py-4 first:pt-1 last:pb-1 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div class="min-w-0">
                  <div class="mb-1.5 flex flex-wrap items-center gap-2"><a-tag :color="item.color" size="small">{{ item.type }}</a-tag><h3 class="truncate text-sm font-medium text-slate-900">{{ item.title }}</h3></div>
                  <p class="truncate text-xs text-slate-500">{{ item.context }}</p>
                  <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400"><span class="flex items-center gap-1"><IconClockCircle />{{ item.time }}</span><span>{{ item.owner }}</span></div>
                </div>
                <a-button size="small" @click="handleAction(item.action)">{{ item.action }} <IconArrowRight /></a-button>
              </div>
            </div>
          </a-card>

          <a-card v-if="activeRole !== 'employee'" :bordered="false" class="!rounded-2xl !border !border-slate-200/80 shadow-none">
            <template #title><span class="text-[15px] font-semibold text-slate-900">重点项目与任务进展</span></template>
            <template #extra><a-link @click="handleAction('进入项目中心')">进入项目中心 <IconArrowRight /></a-link></template>
            <div class="overflow-x-auto">
              <div class="min-w-[680px]">
                <div class="grid grid-cols-[1.2fr_0.7fr_1.25fr_0.65fr_0.7fr_32px] gap-4 border-b border-slate-100 pb-3 text-xs text-slate-400"><span>项目</span><span>进度</span><span>下一里程碑</span><span>计划日期</span><span>状态</span><span /></div>
                <div v-for="project in projects" :key="project.name" class="grid grid-cols-[1.2fr_0.7fr_1.25fr_0.65fr_0.7fr_32px] items-center gap-4 border-b border-slate-100 py-4 text-sm last:border-0 last:pb-1">
                  <div><div class="font-medium text-slate-900">{{ project.name }}</div><div class="mt-1 text-xs text-slate-400">{{ project.stage }}</div></div>
                  <div><a-progress :percent="project.progress / 100" size="small" :show-text="false" /><span class="mt-1 block text-xs text-slate-500">{{ project.progress }}%</span></div>
                  <span class="text-slate-700">{{ project.milestone }}</span><span class="text-slate-500">{{ project.date }}</span>
                  <a-tag :color="project.risk === '正常' ? 'green' : project.risk.includes('阻断') ? 'red' : 'orange'" size="small">{{ project.risk }}</a-tag>
                  <a-button type="text" size="mini" @click="handleAction('查看项目')"><IconMore /></a-button>
                </div>
              </div>
            </div>
          </a-card>
        </div>

        <aside class="min-w-0 space-y-4">
          <a-card :bordered="false" class="!rounded-2xl !border !border-slate-200/80 shadow-none">
            <template #title><div class="flex items-center gap-2 text-[15px] font-semibold text-slate-900"><IconRobot class="text-[#165dff]" />AI 工作动态</div></template>
            <template #extra><span class="flex items-center gap-1 text-xs text-emerald-600"><span class="size-1.5 rounded-full bg-emerald-500" />运行正常</span></template>
            <div class="relative before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-slate-100">
              <div v-for="activity in aiActivities" :key="activity.title" class="relative flex gap-3 py-3 first:pt-1 last:pb-1">
                <span class="z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border-4 border-white" :class="activity.icon === 'check' ? 'bg-emerald-100 text-emerald-600' : activity.icon === 'alert' ? 'bg-amber-100 text-amber-600' : 'bg-violet-100 text-violet-600'">
                  <IconCheckCircle v-if="activity.icon === 'check'" /><IconExclamationCircle v-else-if="activity.icon === 'alert'" /><IconClockCircle v-else />
                </span>
                <div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-2"><h3 class="text-sm font-medium text-slate-900">{{ activity.title }}</h3><span class="shrink-0 text-[11px] text-slate-400">{{ activity.time }}</span></div><p class="mt-1 text-xs leading-5 text-slate-500">{{ activity.description }}</p><a-link class="mt-1 !text-xs" @click="handleAction('查看 AI 运行记录')">{{ activity.tag }} · 查看记录</a-link></div>
              </div>
            </div>
          </a-card>
        </aside>
      </div>
    </div>
  </div>
</template>
