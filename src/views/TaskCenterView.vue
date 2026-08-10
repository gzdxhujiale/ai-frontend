<script setup lang="ts">
import { computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconArrowRight,
  IconBranch,
  IconClockCircle,
  IconExclamationCircle,
  IconFilter,
  IconPlus,
  IconRobot,
  IconSearch,
} from '@arco-design/web-vue/es/icon'

type TaskView = 'mine' | 'projects' | 'team' | 'exceptions' | 'bugs' | 'acceptance'

const activeView = ref<TaskView>('mine')
const searchText = ref('')
const statusFilter = ref('全部状态')
const typeFilter = ref('全部类型')

const views = [
  { key: 'mine', label: '我的任务', count: 12 },
  { key: 'projects', label: '项目', count: 3 },
  { key: 'team', label: '团队任务', count: 28 },
  { key: 'exceptions', label: '异常', count: 5 },
  { key: 'bugs', label: 'Bug', count: 4 },
  { key: 'acceptance', label: '待验收', count: 6 },
] satisfies Array<{ key: TaskView; label: string; count: number }>

const taskItems = [
  { id: 'TASK-20260810-021', title: '确认款号 A102 二次工艺结果', type: '业务任务', typeColor: 'arcoblue', priority: '紧急', priorityColor: 'red', status: '进行中', statusColor: 'blue', owner: '王立群', context: '打版执行 / 秋款开发 / A102', deadline: '今天 11:30', source: '规则自动创建', ai: 'AI 已整理资料', progress: 65 },
  { id: 'TASK-20260810-018', title: '确认华东仓重点款补货方案', type: '经营决策', typeColor: 'purple', priority: '高', priorityColor: 'orange', status: '待处理', statusColor: 'gray', owner: '王立群', context: '库存预警 / 华东仓 / 3 个重点款', deadline: '今天 14:00', source: '预警转任务', ai: 'AI 已生成 2 个方案', progress: 0 },
  { id: 'TASK-20260809-114', title: '补充商品资料缺失字段', type: '业务任务', typeColor: 'arcoblue', priority: '普通', priorityColor: 'gray', status: '阻断', statusColor: 'red', owner: '王立群', context: '商品资料补全 / 货号 Q816', deadline: '已超时 3 小时', source: 'AI 应用创建', ai: '等待人工补充图片', progress: 35 },
  { id: 'TASK-20260809-097', title: '客服 AI 质检一期成果验收', type: '项目任务', typeColor: 'green', priority: '高', priorityColor: 'orange', status: '待验收', statusColor: 'purple', owner: '王立群', context: '客服 AI 质检 / 里程碑 3', deadline: '今天 17:00', source: '项目里程碑', ai: 'AI 已完成证据汇总', progress: 100 },
  { id: 'BUG-20260809-012', title: '版单详情页附件预览失败', type: 'Bug', typeColor: 'red', priority: '高', priorityColor: 'orange', status: '进行中', statusColor: 'blue', owner: '王立群', context: '打版执行系统 / 版单详情', deadline: '明天 12:00', source: '用户反馈', ai: 'AI 已定位可能原因', progress: 45 },
]

const filteredTasks = computed(() => taskItems.filter((task) => {
  const matchesSearch = !searchText.value || `${task.title}${task.id}${task.context}`.toLowerCase().includes(searchText.value.toLowerCase())
  const matchesStatus = statusFilter.value === '全部状态' || task.status === statusFilter.value
  const matchesType = typeFilter.value === '全部类型' || task.type === typeFilter.value
  return matchesSearch && matchesStatus && matchesType
}))

const projects = [
  { name: '打版执行系统', objective: '将打版业务流程变成可运行、可验收的执行系统', progress: 72, price: '18.6 万', period: '7月15日—8月30日', milestone: '首轮业务验收', risk: '2 项阻断', cooperation: '确认二次工艺标准' },
  { name: '客服 AI 质检', objective: '实现客服会话自动质检与风险升级闭环', progress: 90, price: '6.8 万', period: '7月25日—8月15日', milestone: '准确率验收', risk: '正常', cooperation: '抽检 50 条结果' },
  { name: '经营语义与指标一期', objective: '建立商品域核心语义、指标与经营看板', progress: 46, price: '9.2 万', period: '8月1日—9月10日', milestone: '商品域指标注册', risk: '1 项风险', cooperation: '确认新品定义' },
]

const handleAction = (label: string) => Message.info(`${label}已进入交互演示`)
</script>

<template>
  <div class="min-h-full bg-[#f5f7fa] px-4 pb-10 pt-2 sm:px-5 lg:px-6">
    <div class="mx-auto max-w-[1500px]">
      <header class="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div><div class="mb-1 flex items-center gap-2"><h1 class="text-[22px] font-semibold tracking-[-0.02em] text-slate-900">任务中心</h1><a-tag color="arcoblue">统一任务入口</a-tag></div><p class="text-sm text-slate-500">推进、跟踪、处理和验收企业所有需要完成的事情</p></div>
        <div class="flex flex-wrap gap-2"><a-button @click="handleAction('AI 创建任务')"><template #icon><IconRobot /></template>AI 创建任务</a-button><a-button type="primary" @click="handleAction('新建任务')"><template #icon><IconPlus /></template>新建任务</a-button></div>
      </header>

      <section class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <button v-for="view in views" :key="view.key" type="button" class="rounded-xl border bg-white px-4 py-3 text-left transition hover:border-blue-300 hover:shadow-sm" :class="activeView === view.key ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200/80'" @click="activeView = view.key">
          <span class="block text-xs text-slate-500">{{ view.label }}</span><strong class="mt-1 block text-xl font-semibold text-slate-900">{{ view.count }}</strong>
        </button>
      </section>

      <template v-if="activeView === 'projects'">
        <section class="space-y-3">
          <article v-for="project in projects" :key="project.name" class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
            <div class="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_240px_minmax(300px,0.85fr)] xl:items-center">
              <div><div class="mb-2 flex flex-wrap items-center gap-2"><h2 class="text-base font-semibold text-slate-900">{{ project.name }}</h2><a-tag :color="project.risk === '正常' ? 'green' : 'orange'">{{ project.risk }}</a-tag></div><p class="text-sm leading-6 text-slate-500">{{ project.objective }}</p><div class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400"><span>项目总价 {{ project.price }}</span><span>{{ project.period }}</span></div></div>
              <div><div class="mb-2 flex items-center justify-between text-xs text-slate-500"><span>总体进度</span><strong class="text-slate-800">{{ project.progress }}%</strong></div><a-progress :percent="project.progress / 100" :show-text="false" /><div class="mt-2 text-xs text-slate-400">下一里程碑：{{ project.milestone }}</div></div>
              <div class="rounded-xl bg-slate-50 p-4"><div class="mb-2 text-xs font-medium text-slate-500">当前客户待配合</div><div class="flex items-center justify-between gap-3"><span class="text-sm font-medium text-slate-800">{{ project.cooperation }}</span><a-button size="small" @click="handleAction('查看项目')">查看 <IconArrowRight /></a-button></div></div>
            </div>
          </article>
        </section>
      </template>

      <template v-else>
        <section class="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div class="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-1 flex-col gap-2 sm:flex-row">
              <a-input v-model="searchText" allow-clear placeholder="搜索任务名称、编号或业务对象" class="w-full sm:max-w-[320px]"><template #prefix><IconSearch /></template></a-input>
              <a-select v-model="statusFilter" class="w-full sm:!w-36"><a-option v-for="status in ['全部状态', '待处理', '进行中', '阻断', '待验收', '已完成']" :key="status">{{ status }}</a-option></a-select>
              <a-select v-model="typeFilter" class="w-full sm:!w-36"><a-option v-for="type in ['全部类型', '业务任务', '经营决策', '项目任务', 'Bug']" :key="type">{{ type }}</a-option></a-select>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400"><IconFilter />共 {{ filteredTasks.length }} 项</div>
          </div>

          <div class="hidden grid-cols-[minmax(260px,1.45fr)_0.8fr_0.75fr_0.75fr_0.55fr_44px] gap-4 border-b border-slate-100 px-5 py-3 text-xs text-slate-400 lg:grid"><span>任务与业务上下文</span><span>状态 / 进度</span><span>负责人</span><span>截止时间</span><span>优先级</span><span /></div>
          <div class="divide-y divide-slate-100">
            <article v-for="task in filteredTasks" :key="task.id" class="grid gap-4 px-5 py-4 transition hover:bg-slate-50/80 lg:grid-cols-[minmax(260px,1.45fr)_0.8fr_0.75fr_0.75fr_0.55fr_44px] lg:items-center">
              <div class="min-w-0"><div class="mb-1.5 flex flex-wrap items-center gap-2"><a-tag :color="task.typeColor" size="small">{{ task.type }}</a-tag><h2 class="truncate text-sm font-medium text-slate-900">{{ task.title }}</h2></div><p class="truncate text-xs text-slate-500">{{ task.context }}</p><div class="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400"><span>{{ task.id }}</span><span>{{ task.source }}</span><span class="flex items-center gap-1 text-violet-600"><IconRobot />{{ task.ai }}</span></div></div>
              <div><a-tag :color="task.statusColor" size="small">{{ task.status }}</a-tag><a-progress v-if="task.progress > 0" class="mt-2 max-w-28" :percent="task.progress / 100" size="small" :show-text="false" /></div>
              <div class="flex items-center gap-2 text-sm text-slate-600"><a-avatar :size="24" class="bg-blue-100 text-xs text-blue-700">王</a-avatar>{{ task.owner }}</div>
              <span class="flex items-center gap-1.5 text-sm" :class="task.deadline.includes('超时') ? 'text-red-600' : 'text-slate-600'"><IconClockCircle />{{ task.deadline }}</span>
              <a-tag :color="task.priorityColor" size="small">{{ task.priority }}</a-tag>
              <a-button type="text" @click="handleAction('打开任务')"><IconArrowRight /></a-button>
            </article>
            <a-empty v-if="filteredTasks.length === 0" class="py-14" description="没有符合条件的任务" />
          </div>
        </section>

        <section class="mt-4 grid gap-4 lg:grid-cols-3">
          <div class="rounded-xl border border-blue-100 bg-blue-50/70 p-4"><div class="flex items-center gap-2 text-sm font-semibold text-blue-900"><IconBranch />统一状态流转</div><p class="mt-2 text-xs leading-5 text-blue-800/70">待处理 → 进行中 → 阻断 → 待验收 → 已完成，每一步都保留责任和证据。</p></div>
          <div class="rounded-xl border border-amber-100 bg-amber-50/70 p-4"><div class="flex items-center gap-2 text-sm font-semibold text-amber-900"><IconExclamationCircle />异常维度独立</div><p class="mt-2 text-xs leading-5 text-amber-800/70">阻断、超时和风险独立标记，避免业务状态与异常状态相互覆盖。</p></div>
          <div class="rounded-xl border border-violet-100 bg-violet-50/70 p-4"><div class="flex items-center gap-2 text-sm font-semibold text-violet-900"><IconRobot />AI 操作需确认</div><p class="mt-2 text-xs leading-5 text-violet-800/70">AI 可以建议并创建基础任务，但涉及业务写入时必须由用户确认。</p></div>
        </section>
      </template>
    </div>
  </div>
</template>
