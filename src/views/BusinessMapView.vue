<script setup lang="ts">
import { computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconArrowRight,
  IconBranch,
  IconCheckCircle,
  IconEye,
  IconRobot,
  IconSearch,
  IconThunderbolt,
} from '@arco-design/web-vue/es/icon'

interface MapModule {
  id: string
  name: string
  description: string
  coverage: number
  status: '已体系化' | '建设中' | '待规划'
  systems: number
  apps: number
  tasks: number
  dashboards: number
  scenes: string[]
}

interface ValueChain {
  id: string
  name: string
  objective: string
  modules: MapModule[]
}

const searchText = ref('')
const statusFilter = ref('全部状态')
const selectedModuleId = ref('product-planning')

const chains: ValueChain[] = [
  { id: 'product', name: '商品价值链', objective: '从市场洞察到商品上市', modules: [
    { id: 'product-planning', name: '商品企划', description: '承接趋势、竞品与销售事实，形成商品规划和开发任务。', coverage: 76, status: '已体系化', systems: 1, apps: 2, tasks: 18, dashboards: 2, scenes: ['竞店上新监测', '商品企划评审', '开发任务分解'] },
    { id: 'sample', name: '打版开发', description: '管理版单、物料、纸样、车版、工艺、审核与结果验收。', coverage: 68, status: '建设中', systems: 1, apps: 1, tasks: 42, dashboards: 1, scenes: ['版单创建', '物料准备', '纸样与车版', '二次工艺', '审核验收'] },
    { id: 'listing', name: '商品上架', description: '完成商品资料、图片、价格、库存和货期的上线准备。', coverage: 82, status: '已体系化', systems: 0, apps: 3, tasks: 12, dashboards: 1, scenes: ['资料补全', '图片检查', '价格库存货期设置'] },
  ]},
  { id: 'marketing', name: '营销增长链', objective: '从内容投放到用户转化', modules: [
    { id: 'content', name: '内容运营', description: '内容生产、发布、效果检测和复盘。', coverage: 44, status: '建设中', systems: 0, apps: 1, tasks: 16, dashboards: 1, scenes: ['内容生产', '素材审核', '效果检测'] },
    { id: 'campaign', name: '活动营销', description: '活动计划、资源协调、执行与效果复盘。', coverage: 25, status: '待规划', systems: 0, apps: 0, tasks: 8, dashboards: 1, scenes: ['活动策划', '活动执行', '活动复盘'] },
    { id: 'membership', name: '会员经营', description: '会员分层、触达、复购和生命周期经营。', coverage: 12, status: '待规划', systems: 0, apps: 0, tasks: 4, dashboards: 0, scenes: ['会员分层', '自动触达', '复购分析'] },
  ]},
  { id: 'delivery', name: '订单履约链', objective: '从订单进入到交付完成', modules: [
    { id: 'inventory', name: '库存协同', description: '库存监测、风险识别、调拨与补货协同。', coverage: 71, status: '已体系化', systems: 0, apps: 2, tasks: 23, dashboards: 2, scenes: ['库存预警', '补货建议', '库存调整'] },
    { id: 'fulfillment', name: '订单履约', description: '订单、仓配、时效、异常与客户通知协同。', coverage: 58, status: '建设中', systems: 1, apps: 1, tasks: 31, dashboards: 2, scenes: ['订单处理', '仓库履约', '时效预警', '异常升级'] },
    { id: 'service', name: '客户服务', description: '客服接待、质量检测、客诉与风险处理。', coverage: 79, status: '已体系化', systems: 0, apps: 2, tasks: 19, dashboards: 1, scenes: ['客服质检', '客诉升级', '服务复盘'] },
  ]},
  { id: 'management', name: '经营管理链', objective: '从经营事实到决策与改善', modules: [
    { id: 'finance', name: '业财经营', description: '收入、成本、费用、毛利、利润与预算经营。', coverage: 52, status: '建设中', systems: 1, apps: 2, tasks: 14, dashboards: 4, scenes: ['自动对账', '费用分析', '毛利经营', '阿米巴'] },
    { id: 'people', name: '组织与绩效', description: '组织、人事合规、业务绩效与人才发展。', coverage: 38, status: '建设中', systems: 1, apps: 1, tasks: 11, dashboards: 2, scenes: ['人事合规', '业务绩效', '组织盘点'] },
    { id: 'review', name: '经营复盘', description: '经营日报、异常分析、专项分析和复盘改善。', coverage: 64, status: '已体系化', systems: 0, apps: 1, tasks: 9, dashboards: 5, scenes: ['经营日报', '异常分析', '专项复盘'] },
  ]},
]

const selectedModule = computed(() => chains.flatMap((chain) => chain.modules).find((module) => module.id === selectedModuleId.value) ?? chains[0].modules[0])
const visibleChains = computed(() => chains.map((chain) => ({
  ...chain,
  modules: chain.modules.filter((module) => {
    const matchesSearch = !searchText.value || `${chain.name}${module.name}${module.scenes.join('')}`.toLowerCase().includes(searchText.value.toLowerCase())
    const matchesStatus = statusFilter.value === '全部状态' || module.status === statusFilter.value
    return matchesSearch && matchesStatus
  }),
})).filter((chain) => chain.modules.length > 0))

const statusClass: Record<string, string> = { '已体系化': 'bg-emerald-50 text-emerald-700', '建设中': 'bg-amber-50 text-amber-700', '待规划': 'bg-slate-100 text-slate-500' }
const coverageClass = (coverage: number) => coverage >= 70 ? 'bg-emerald-500' : coverage >= 40 ? 'bg-blue-500' : 'bg-slate-300'
const handleAction = (label: string) => Message.info(`${label}已进入交互演示`)
</script>

<template>
  <div class="min-h-full bg-[#f5f7fa] px-4 pb-10 pt-2 sm:px-5 lg:px-6">
    <div class="mx-auto max-w-[1500px]">
      <header class="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div><div class="mb-1 flex items-center gap-2"><h1 class="text-[22px] font-semibold tracking-[-0.02em] text-slate-900">经营地图</h1><a-tag color="purple">企业能力全景</a-tag></div><p class="text-sm text-slate-500">看清企业哪些业务已经被体系化、数字化和 AI 化</p></div>
        <div class="flex flex-wrap gap-2"><a-button @click="handleAction('查看地图说明')"><template #icon><IconEye /></template>地图说明</a-button><a-button type="primary" @click="handleAction('进入 AI 升级')"><template #icon><IconThunderbolt /></template>规划下一轮升级</a-button></div>
      </header>

      <section class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <div v-for="item in [{ label: '价值链', value: '4', note: '覆盖企业核心经营' }, { label: '领域模块', value: '12', note: '5 个已体系化' }, { label: '业务场景', value: '38', note: '24 个已接入底座' }, { label: '应用与系统', value: '19', note: '15 个正在运行' }, { label: '任务实例', value: '12,846', note: '本月新增 1,923' }, { label: '综合覆盖率', value: '56%', note: '较上月 +6%' }]" :key="item.label" class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm"><span class="text-xs text-slate-400">{{ item.label }}</span><strong class="mt-1 block text-xl font-semibold text-slate-900">{{ item.value }}</strong><span class="mt-1 block text-[11px] text-slate-400">{{ item.note }}</span></div>
      </section>

      <section class="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap items-center gap-4 text-xs"><span class="font-medium text-slate-600">成熟度图例</span><span class="flex items-center gap-1.5 text-slate-500"><i class="size-2 rounded-full bg-emerald-500" />已体系化</span><span class="flex items-center gap-1.5 text-slate-500"><i class="size-2 rounded-full bg-blue-500" />建设中</span><span class="flex items-center gap-1.5 text-slate-500"><i class="size-2 rounded-full bg-slate-300" />待规划</span></div>
        <div class="flex flex-col gap-2 sm:flex-row"><a-input v-model="searchText" allow-clear placeholder="搜索模块或业务场景" class="w-full sm:!w-64"><template #prefix><IconSearch /></template></a-input><a-select v-model="statusFilter" class="w-full sm:!w-32"><a-option v-for="status in ['全部状态', '已体系化', '建设中', '待规划']" :key="status">{{ status }}</a-option></a-select></div>
      </section>

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <section class="min-w-0 space-y-4">
          <article v-for="chain in visibleChains" :key="chain.id" class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div class="flex items-center gap-3"><span class="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#165dff]"><IconBranch /></span><div><h2 class="text-sm font-semibold text-slate-900">{{ chain.name }}</h2><p class="mt-0.5 text-xs text-slate-400">{{ chain.objective }}</p></div></div><span class="text-xs text-slate-400">价值链 → 模块 → 场景 → 运行资产</span></div>
            <div class="grid gap-3 p-4 lg:grid-cols-3">
              <button v-for="module in chain.modules" :key="module.id" type="button" class="rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md" :class="selectedModuleId === module.id ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-100' : 'border-slate-200 bg-white'" @click="selectedModuleId = module.id">
                <div class="mb-3 flex items-start justify-between gap-2"><div><h3 class="text-sm font-semibold text-slate-900">{{ module.name }}</h3><span class="mt-1 inline-flex rounded-md px-2 py-0.5 text-[11px]" :class="statusClass[module.status]">{{ module.status }}</span></div><strong class="text-lg font-semibold text-slate-900">{{ module.coverage }}%</strong></div>
                <div class="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full transition-all" :class="coverageClass(module.coverage)" :style="{ width: `${module.coverage}%` }" /></div>
                <div class="grid grid-cols-4 gap-1 text-center"><div><strong class="block text-xs text-slate-800">{{ module.systems }}</strong><span class="text-[10px] text-slate-400">系统</span></div><div><strong class="block text-xs text-slate-800">{{ module.apps }}</strong><span class="text-[10px] text-slate-400">应用</span></div><div><strong class="block text-xs text-slate-800">{{ module.tasks }}</strong><span class="text-[10px] text-slate-400">任务</span></div><div><strong class="block text-xs text-slate-800">{{ module.dashboards }}</strong><span class="text-[10px] text-slate-400">看板</span></div></div>
              </button>
            </div>
          </article>
          <a-empty v-if="visibleChains.length === 0" class="rounded-2xl border border-slate-200 bg-white py-16" description="没有符合条件的经营模块" />
        </section>

        <aside class="min-w-0 xl:sticky xl:top-4 xl:self-start">
          <a-card :bordered="false" class="!rounded-2xl !border !border-slate-200/80 shadow-sm">
            <template #title><span class="text-[15px] font-semibold text-slate-900">{{ selectedModule.name }}</span></template>
            <template #extra><span class="rounded-md px-2 py-1 text-xs" :class="statusClass[selectedModule.status]">{{ selectedModule.status }}</span></template>
            <p class="text-sm leading-6 text-slate-500">{{ selectedModule.description }}</p>
            <div class="mt-5"><div class="mb-2 flex items-center justify-between text-xs text-slate-500"><span>AI 化覆盖率</span><strong class="text-slate-900">{{ selectedModule.coverage }}%</strong></div><a-progress :percent="selectedModule.coverage / 100" :show-text="false" /></div>
            <div class="mt-5 border-t border-slate-100 pt-4"><h3 class="mb-3 text-xs font-semibold text-slate-500">已识别业务场景</h3><div class="space-y-2"><div v-for="scene in selectedModule.scenes" :key="scene" class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"><span class="flex items-center gap-2"><IconCheckCircle class="text-emerald-500" />{{ scene }}</span><IconArrowRight class="text-slate-300" /></div></div></div>
            <div class="mt-5 grid grid-cols-2 gap-2"><button v-for="asset in [{ icon: 'apps', label: '应用', value: selectedModule.apps }, { icon: 'task', label: '运行任务', value: selectedModule.tasks }, { icon: 'board', label: '经营看板', value: selectedModule.dashboards }, { icon: 'system', label: '执行系统', value: selectedModule.systems }]" :key="asset.label" type="button" class="rounded-lg border border-slate-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50" @click="handleAction(`查看${asset.label}`)"><span class="text-xs text-slate-400">{{ asset.label }}</span><strong class="mt-1 block text-lg text-slate-900">{{ asset.value }}</strong></button></div>
            <a-button long type="primary" class="mt-5" @click="handleAction('查看模块详情')">查看模块详情 <IconArrowRight /></a-button>
          </a-card>

          <div class="mt-4 rounded-2xl bg-gradient-to-br from-[#272b53] to-[#165dff] p-5 text-white shadow-lg"><div class="mb-2 flex items-center gap-2 text-sm font-semibold"><IconRobot />AI 升级建议</div><p class="text-xs leading-6 text-blue-100">该模块仍有 2 个高频人工环节。建议下一步优先建设“物料齐套自动校验”，预计每月节省 6.4 人天。</p><a-button type="text" class="mt-2 !px-0 !text-white" @click="handleAction('查看升级机会')">查看升级机会 <IconArrowRight /></a-button></div>
        </aside>
      </div>
    </div>
  </div>
</template>
