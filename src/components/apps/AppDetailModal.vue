<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconCheckCircle,
  IconClockCircle,
  IconCode,
  IconDownload,
  IconFile,
  IconInfoCircle,
  IconLock,
  IconPlayArrow,
  IconPlus,
  IconPoweroff,
  IconRobot,
  IconShareInternal,
  IconUser,
} from '@arco-design/web-vue/es/icon'
import { useAppCenterStore } from '../../stores/appCenter'
import type { AppExecutionLog, AppIOField } from '../../stores/appCenter'
import AppInteractiveDialogModal from './AppInteractiveDialogModal.vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

const appStore = useAppCenterStore()
const app = computed(() => appStore.selectedApp)

const activeTab = ref('overview')
const interactiveModalVisible = ref(false)
const selectedLogDetail = ref<AppExecutionLog | null>(null)
const logDrawerVisible = ref(false)

watch(
  () => appStore.activeTabInDetail,
  (newTab) => {
    if (newTab) activeTab.value = newTab
  },
  { immediate: true },
)

const handleClose = () => emit('update:visible', false)

const handleToggleInstall = () => {
  if (!app.value) return
  appStore.toggleInstall(app.value.id)
  Message.success({
    content: app.value.isInstalled ? `已成功获取/安装应用 [${app.value.name}]` : `已卸载应用 [${app.value.name}]`,
  })
}

const handleToggleEnable = () => {
  if (!app.value) return
  appStore.toggleEnable(app.value.id)
  Message.info({
    content: app.value.isEnabled ? `应用 [${app.value.name}] 已启用` : `应用 [${app.value.name}] 已暂停使用`,
  })
}

const handleShare = () => {
  if (!app.value) return
  navigator.clipboard.writeText?.(window.location.href)
  Message.success({ content: `应用链接已复制到剪贴板，可分享给同组成员` })
}

const handleRunClick = () => {
  interactiveModalVisible.value = true
}

const handleViewLogDetail = (log: AppExecutionLog) => {
  selectedLogDetail.value = log
  logDrawerVisible.value = true
}

const spaceLabels: Record<string, string> = {
  personal: '个人空间',
  public: '公共空间',
  rnd: '研发中心',
  jv: '合资企业',
}

// Inline Trigger Edit / Add simulation
const newTriggerName = ref('')
const newTriggerType = ref<'cron' | 'event' | 'webhook'>('cron')
const newTriggerConfig = ref('')
const addTriggerModalVisible = ref(false)

const handleAddTrigger = () => {
  if (!app.value || !newTriggerName.value) return
  app.value.triggers.push({
    id: `trig-${Date.now()}`,
    name: newTriggerName.value,
    type: newTriggerType.value,
    config: newTriggerConfig.value || '默认配置',
    enabled: true,
  })
  Message.success({ content: '触发器添加成功' })
  addTriggerModalVisible.value = false
  newTriggerName.value = ''
  newTriggerConfig.value = ''
}

// Input Field Editing State
const inputFieldModalVisible = ref(false)
const editingFieldIndex = ref<number | null>(null)
const inputFieldForm = reactive<AppIOField>({
  key: '',
  label: '',
  type: 'text',
  required: false,
  defaultValue: '',
  description: '',
})

const handleAddInputField = () => {
  editingFieldIndex.value = null
  inputFieldForm.key = ''
  inputFieldForm.label = ''
  inputFieldForm.type = 'text'
  inputFieldForm.required = false
  inputFieldForm.defaultValue = ''
  inputFieldForm.description = ''
  inputFieldModalVisible.value = true
}

const handleEditInputField = (index: number) => {
  if (!app.value) return
  const item = app.value.inputs[index]
  if (!item) return
  editingFieldIndex.value = index
  inputFieldForm.key = item.key
  inputFieldForm.label = item.label
  inputFieldForm.type = item.type
  inputFieldForm.required = item.required
  inputFieldForm.defaultValue = item.defaultValue ?? ''
  inputFieldForm.description = item.description || ''
  inputFieldModalVisible.value = true
}

const handleDeleteInputField = (index: number) => {
  if (!app.value) return
  const item = app.value.inputs[index]
  app.value.inputs.splice(index, 1)
  Message.success({ content: `已删除输入字段 [${item?.label || item?.key}]` })
}

const handleSaveInputField = () => {
  if (!app.value) return
  if (!inputFieldForm.key.trim() || !inputFieldForm.label.trim()) {
    Message.warning({ content: '请填写字段 Key 和显示名称' })
    return
  }

  const payload: AppIOField = {
    key: inputFieldForm.key.trim(),
    label: inputFieldForm.label.trim(),
    type: inputFieldForm.type,
    required: inputFieldForm.required,
    defaultValue: inputFieldForm.defaultValue,
    description: inputFieldForm.description.trim(),
  }

  if (editingFieldIndex.value !== null) {
    app.value.inputs[editingFieldIndex.value] = payload
    Message.success({ content: `输入字段 [${payload.label}] 配置更新成功！` })
  } else {
    app.value.inputs.push(payload)
    Message.success({ content: `新增输入配置字段 [${payload.label}] 成功！` })
  }

  inputFieldModalVisible.value = false
}
</script>

<template>
  <a-modal
    :visible="visible"
    :footer="false"
    :unmount-on-close="true"
    :width="1100"
    class="shadow-2xl rounded-2xl overflow-hidden app-detail-modal"
    @cancel="handleClose"
  >
    <template #title>
      <div v-if="app" class="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-8 gap-3 py-1">
        <div class="flex items-center gap-3">
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl text-[#165dff] shadow-sm"
          >
            <IconRobot v-if="app.icon === 'ai'" />
            <IconFile v-else-if="app.icon === 'file-text'" />
            <IconThunderbolt v-else-if="app.icon === 'shopping'" />
            <IconCheckCircle v-else />
          </span>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-lg font-bold text-slate-900 leading-snug">{{ app.name }}</h2>
              <a-tag v-if="app.isOfficial" color="red" size="small">官方出品</a-tag>
              <a-tag size="small">{{ app.level }}</a-tag>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">{{ app.developer }} · 更新时间: {{ app.lastRunTime }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <a-button type="outline" size="medium" class="!rounded-[2px]" @click="handleShare">
            <template #icon><IconShareInternal /></template>
            分享
          </a-button>

          <a-button
            v-if="!app.isInstalled"
            type="primary"
            size="medium"
            class="!rounded-[2px] !bg-rose-500 hover:!bg-rose-600 !px-5"
            @click="handleToggleInstall"
          >
            <template #icon><IconDownload /></template>
            获取应用
          </a-button>

          <template v-else>
            <a-button
              type="primary"
              size="medium"
              class="!rounded-[2px] !bg-emerald-600 hover:!bg-emerald-700 !px-4"
              @click="handleRunClick"
            >
              <template #icon><IconPlayArrow /></template>
              运行交互对话框 (测试)
            </a-button>

            <a-button
              :type="app.isEnabled ? 'outline' : 'primary'"
              :status="app.isEnabled ? 'warning' : 'success'"
              size="medium"
              class="!rounded-[2px]"
              @click="handleToggleEnable"
            >
              <template #icon><IconPoweroff /></template>
              {{ app.isEnabled ? '暂停服务' : '启用应用' }}
            </a-button>
          </template>
        </div>
      </div>
    </template>

    <div v-if="app" class="min-h-[620px] flex flex-col">
      <!-- Top Navigation Tabs (Arco Line Style with Underline) -->
      <a-tabs v-model:active-key="activeTab" type="line" size="medium" class="app-detail-tabs mb-4">
        <a-tab-pane key="overview" title="应用概览与说明" />
        <a-tab-pane key="config" title="输入输出配置与交互框" />
        <a-tab-pane key="triggers" title="触发器配置" />
        <a-tab-pane key="status_logs" title="运行状态与日志统计" />
        <a-tab-pane key="versions" title="版本历史演进" />
        <a-tab-pane key="permissions" title="租户与空间权限映射" />
      </a-tabs>

      <!-- Tab 1: Overview & Markdown Docs (ShadowBot Style) -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-3 gap-6 flex-1">
        <!-- Left 2 Cols: Markdown Documentation -->
        <div class="col-span-2 space-y-6 overflow-y-auto max-h-[540px] pr-2">
          <!-- Usage Notes Alert -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <h3 class="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <IconInfoCircle class="text-[#165dff]" /> 使用说明与架构说明
            </h3>
            <div class="text-xs text-slate-600 whitespace-pre-wrap leading-6">
              {{ app.usageDoc }}
            </div>
          </div>

          <!-- Background Section -->
          <div class="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
            <h3 class="text-base font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">背景介绍</h3>
            <div class="text-sm text-slate-700 leading-7 whitespace-pre-wrap">
              {{ app.backgroundDoc }}
            </div>
          </div>

          <!-- Requirements Section -->
          <div class="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
            <h3 class="text-base font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">需求调研与特点</h3>
            <div class="text-sm text-slate-700 leading-7 whitespace-pre-wrap">
              {{ app.requirementsDoc }}
            </div>
          </div>

          <!-- Feature Description Section -->
          <div class="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
            <h3 class="text-base font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">核心功能描述</h3>
            <div class="text-sm text-slate-700 leading-7 whitespace-pre-wrap">
              {{ app.featureDoc }}
            </div>
          </div>
        </div>

        <!-- Right 1 Col: App Meta Info (ShadowBot Right Panel) -->
        <div class="space-y-4">
          <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div>
              <span class="text-xs text-slate-400 block mb-1">开发者/研发团队</span>
              <div class="flex items-center gap-2">
                <a-avatar :size="28" class="bg-blue-100 text-[#165dff]"><IconUser /></a-avatar>
                <div>
                  <span class="text-xs font-semibold text-slate-800 block">{{ app.developer }}</span>
                  <span class="text-[11px] text-slate-400 block">{{ app.developerEmail }}</span>
                </div>
              </div>
            </div>

            <a-divider class="!my-2" />

            <div>
              <span class="text-xs text-slate-400 block mb-1">包含标签</span>
              <div class="flex flex-wrap gap-1.5">
                <a-tag v-for="tag in app.tags" :key="tag" size="small" color="arcoblue">{{ tag }}</a-tag>
              </div>
            </div>

            <a-divider class="!my-2" />

            <div>
              <span class="text-xs text-slate-400 block mb-1">所属空间</span>
              <a-tag color="green" size="small">{{ spaceLabels[app.space] || app.space }}</a-tag>
            </div>

            <a-divider class="!my-2" />

            <div class="grid grid-cols-2 gap-2 text-center pt-1">
              <div class="bg-white rounded-lg p-2 border border-slate-100">
                <span class="text-[11px] text-slate-400 block">点赞好评</span>
                <strong class="text-sm text-slate-800">👍 {{ app.likes }}</strong>
              </div>
              <div class="bg-white rounded-lg p-2 border border-slate-100">
                <span class="text-[11px] text-slate-400 block">获取安装</span>
                <strong class="text-sm text-slate-800">📥 {{ app.installs }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Config & Input/Output Schema Preview (ShadowBot Interactive Dialog) -->
      <div v-else-if="activeTab === 'config'" class="space-y-6 max-h-[540px] overflow-y-auto pr-1">
        <!-- Input Parameters Schema -->
        <div class="rounded-xl border border-slate-200 bg-white p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span class="size-2 rounded-full bg-blue-500" /> 输入参数表 (Input Schema)
            </h4>
            <a-button type="primary" size="small" class="!rounded-[2px]" @click="handleAddInputField">
              <template #icon><IconPlus /></template>
              新增配置字段
            </a-button>
          </div>
          <a-table :data="app.inputs" :pagination="false" size="small" border>
            <template #columns>
              <a-table-column title="字段 Key" data-index="key" :width="140" />
              <a-table-column title="显示名称" data-index="label" :width="150" />
              <a-table-column title="控件类型" data-index="type" :width="110">
                <template #cell="{ record }">
                  <a-tag size="small" color="purple">{{ record.type }}</a-tag>
                </template>
              </a-table-column>
              <a-table-column title="必填" data-index="required" :width="75">
                <template #cell="{ record }">
                  <span :class="record.required ? 'text-rose-600 font-bold' : 'text-slate-400'">{{ record.required ? '是' : '否' }}</span>
                </template>
              </a-table-column>
              <a-table-column title="默认值" data-index="defaultValue" :width="150">
                <template #cell="{ record }">
                  <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{{ record.defaultValue || '--' }}</code>
                </template>
              </a-table-column>
              <a-table-column title="字段说明" data-index="description" />
              <a-table-column title="操作" :width="120" align="center">
                <template #cell="{ rowIndex }">
                  <div class="flex items-center justify-center gap-1">
                    <a-button type="text" size="mini" class="!text-blue-600" @click="handleEditInputField(rowIndex)">编辑</a-button>
                    <a-popconfirm content="确定要删除此输入参数字段吗？" @ok="handleDeleteInputField(rowIndex)">
                      <a-button type="text" size="mini" status="danger">删除</a-button>
                    </a-popconfirm>
                  </div>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>

        <!-- Output Parameters Schema -->
        <div class="rounded-xl border border-slate-200 bg-white p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span class="size-2 rounded-full bg-emerald-500" /> 输出参数表 (Output Schema)
            </h4>
          </div>
          <a-table :data="app.outputs" :pagination="false" size="small" border>
            <template #columns>
              <a-table-column title="输出 Key" data-index="key" :width="160" />
              <a-table-column title="输出名称" data-index="label" :width="180" />
              <a-table-column title="数据类型" data-index="type" :width="120">
                <template #cell="{ record }">
                  <a-tag size="small" color="green">{{ record.type }}</a-tag>
                </template>
              </a-table-column>
              <a-table-column title="输出描述" data-index="description" />
            </template>
          </a-table>
        </div>
      </div>

      <!-- Tab 3: Triggers Configuration -->
      <div v-else-if="activeTab === 'triggers'" class="space-y-4 max-h-[540px] overflow-y-auto pr-1">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-800">应用触发器管理</h3>
            <p class="text-xs text-slate-500">支持配置定时调度 (Cron)、业务事件、Webhook 回调与快捷键。</p>
          </div>
          <a-button type="primary" size="small" class="!rounded-lg" @click="addTriggerModalVisible = true">
            <template #icon><IconPlus /></template>
            新增触发器
          </a-button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="trig in app.triggers"
            :key="trig.id"
            class="rounded-xl border border-slate-200 bg-white p-4 flex items-start justify-between shadow-xs"
          >
            <div class="flex items-start gap-3">
              <span class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#165dff] text-lg">
                <IconClockCircle v-if="trig.type === 'cron'" />
                <IconThunderbolt v-else-if="trig.type === 'event'" />
                <IconCode v-else />
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-800 text-sm">{{ trig.name }}</span>
                  <a-tag size="small" color="arcoblue">{{ trig.type }}</a-tag>
                </div>
                <p class="text-xs text-slate-500 mt-1 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                  {{ trig.config }}
                </p>
              </div>
            </div>

            <a-switch v-model="trig.enabled" size="small" />
          </div>
        </div>
      </div>

      <!-- Tab 4: Status & Execution Logs & Statistics -->
      <div v-else-if="activeTab === 'status_logs'" class="space-y-6 max-h-[540px] overflow-y-auto pr-1">
        <!-- Status & Stats Dashboard Cards -->
        <div class="grid grid-cols-4 gap-4">
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <span class="text-xs text-slate-400 block mb-1">当前运行状态</span>
            <div class="flex items-center gap-2">
              <span
                class="size-2.5 rounded-full"
                :class="{
                  'bg-emerald-500 animate-pulse': app.runStatus === 'running',
                  'bg-blue-500': app.runStatus === 'idle',
                  'bg-rose-500': app.runStatus === 'failed',
                  'bg-amber-500': app.runStatus === 'paused',
                }"
              />
              <strong class="text-base font-bold text-slate-900 capitalize">{{ app.runStatus }}</strong>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <span class="text-xs text-slate-400 block mb-1">成功率</span>
            <strong class="text-xl font-bold text-emerald-600">{{ app.successRate }}%</strong>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <span class="text-xs text-slate-400 block mb-1">累计节省时间</span>
            <strong class="text-xl font-bold text-slate-900">{{ app.savedPersonDays }}</strong>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <span class="text-xs text-slate-400 block mb-1">运行成本/节省</span>
            <strong class="text-xl font-bold text-slate-900">{{ app.costSaved }}</strong>
          </div>
        </div>

        <!-- Logs History Table -->
        <div class="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-slate-800">历史运行日志 (Execution Logs)</h4>
            <a-button type="outline" size="mini" @click="handleRunClick">手动测试运行一次</a-button>
          </div>

          <a-table :data="app.logs" :pagination="{ pageSize: 5 }" size="small" border>
            <template #columns>
              <a-table-column title="日志 ID" data-index="id" :width="100" />
              <a-table-column title="开始时间" data-index="startTime" :width="170" />
              <a-table-column title="耗时" data-index="duration" :width="90" />
              <a-table-column title="触发来源" data-index="triggerSource" :width="140" />
              <a-table-column title="运行结果" data-index="status" :width="110">
                <template #cell="{ record }">
                  <a-tag v-if="record.status === 'success'" color="green" size="small">成功</a-tag>
                  <a-tag v-else-if="record.status === 'running'" color="arcoblue" size="small">运行中</a-tag>
                  <a-tag v-else color="red" size="small">失败</a-tag>
                </template>
              </a-table-column>
              <a-table-column title="输出摘要" data-index="outputSummary" />
              <a-table-column title="操作" :width="90">
                <template #cell="{ record }">
                  <a-link size="small" @click="handleViewLogDetail(record)">日志详情</a-link>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </div>

      <!-- Tab 5: Version History (Timeline Style) -->
      <div v-else-if="activeTab === 'versions'" class="space-y-4 max-h-[540px] overflow-y-auto pr-2 py-2">
        <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">版本演进与 Changelog</h3>
        <a-timeline mode="left">
          <a-timeline-item
            v-for="ver in app.versions"
            :key="ver.version"
            :label="ver.releaseTime"
          >
            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900 text-sm">{{ ver.version }}</span>
                  <a-tag size="small" color="blue">发布者: {{ ver.author }}</a-tag>
                </div>
              </div>
              <p class="text-xs text-slate-600 leading-5 mt-1">{{ ver.changelog }}</p>
            </div>
          </a-timeline-item>
        </a-timeline>
      </div>

      <!-- Tab 6: Tenant, Space & Permission Mapping -->
      <div v-else-if="activeTab === 'permissions'" class="space-y-6 max-h-[540px] overflow-y-auto pr-1">
        <div class="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <IconLock class="text-[#165dff]" /> 空间映射与角色权限规则 (RBAC)
          </h3>

          <div>
            <label class="text-xs font-semibold text-slate-700 block mb-1.5">发布空间归属</label>
            <a-checkbox-group v-model="app.permissions.spaces" class="flex gap-4">
              <a-checkbox value="personal">个人空间</a-checkbox>
              <a-checkbox value="public">公共空间</a-checkbox>
              <a-checkbox value="rnd">研发中心</a-checkbox>
              <a-checkbox value="jv">合资企业</a-checkbox>
            </a-checkbox-group>
          </div>

          <a-divider />

          <div>
            <label class="text-xs font-semibold text-slate-700 block mb-2">角色权限映射矩阵</label>
            <a-table :data="app.permissions.roles" :pagination="false" size="small" border>
              <template #columns>
                <a-table-column title="角色 key" data-index="role" :width="180" />
                <a-table-column title="角色名称" data-index="roleName" :width="200" />
                <a-table-column title="操作权限等级" data-index="access">
                  <template #cell="{ record }">
                    <a-select v-model="record.access" size="small" class="w-36 minimal-radius !rounded-[2px]">
                      <a-option value="admin">管理员 (全部权限)</a-option>
                      <a-option value="operator">操作员 (可执行配置)</a-option>
                      <a-option value="viewer">查看者 (仅读取)</a-option>
                    </a-select>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub Modal: Log Detail Drawer -->
    <a-drawer v-model:visible="logDrawerVisible" :width="500" title="运行日志详情" :footer="false">
      <div v-if="selectedLogDetail" class="space-y-4">
        <div class="rounded-lg bg-slate-900 text-slate-200 p-4 font-mono text-xs leading-6 overflow-x-auto whitespace-pre-wrap">
          {{ selectedLogDetail.logText }}
        </div>
      </div>
    </a-drawer>

    <!-- Sub Modal: Add Trigger Modal -->
    <a-modal v-model:visible="addTriggerModalVisible" title="添加新触发器" @ok="handleAddTrigger">
      <a-form :model="{ newTriggerName, newTriggerType, newTriggerConfig }" layout="vertical">
        <a-form-item label="触发器名称" required>
          <a-input v-model="newTriggerName" placeholder="例如：工作日下班定时轮询" class="minimal-radius !rounded-[2px]" />
        </a-form-item>
        <a-form-item label="触发器类型">
          <a-select v-model="newTriggerType" class="minimal-radius !rounded-[2px]">
            <a-option value="cron">定时 Cron</a-option>
            <a-option value="event">业务事件监听</a-option>
            <a-option value="webhook">Webhook 回调</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="规则表达式 / 事件描述">
          <a-input v-model="newTriggerConfig" placeholder="0 18 * * 1-5 或 订单支付成功事件" class="minimal-radius !rounded-[2px]" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Sub Modal: Add/Edit Input Field Modal -->
    <a-modal
      v-model:visible="inputFieldModalVisible"
      :title="editingFieldIndex !== null ? '编辑输入参数配置字段' : '新增输入参数配置字段'"
      @ok="handleSaveInputField"
    >
      <a-form :model="inputFieldForm" layout="vertical">
        <div class="grid grid-cols-2 gap-3">
          <a-form-item label="字段 Key" required>
            <a-input v-model="inputFieldForm.key" placeholder="例如：start_date" class="minimal-radius !rounded-[2px]" />
          </a-form-item>
          <a-form-item label="显示名称" required>
            <a-input v-model="inputFieldForm.label" placeholder="例如：检索开始时间" class="minimal-radius !rounded-[2px]" />
          </a-form-item>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <a-form-item label="控件类型">
            <a-select v-model="inputFieldForm.type" class="minimal-radius !rounded-[2px]">
              <a-option value="text">单行文本 (text)</a-option>
              <a-option value="date">日期时间 (date)</a-option>
              <a-option value="select">下拉单选 (select)</a-option>
              <a-option value="multiselect">下拉多选 (multiselect)</a-option>
              <a-option value="file">文件路径 (file)</a-option>
              <a-option value="number">数字输入 (number)</a-option>
              <a-option value="boolean">开关布尔 (boolean)</a-option>
            </a-select>
          </a-form-item>

          <a-form-item label="是否必填">
            <a-radio-group v-model="inputFieldForm.required" type="button" size="medium">
              <a-radio :value="true">必填</a-radio>
              <a-radio :value="false">选填</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>

        <a-form-item label="默认初始值">
          <a-input v-model="inputFieldForm.defaultValue" placeholder="请输入参数默认初始值..." class="minimal-radius !rounded-[2px]" />
        </a-form-item>

        <a-form-item label="字段功能说明">
          <a-textarea v-model="inputFieldForm.description" placeholder="请输入对该参数字段的使用解释或格式要求..." class="minimal-radius !rounded-[2px]" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Interactive Dialog Modal Integration -->
    <AppInteractiveDialogModal
      v-model:visible="interactiveModalVisible"
      :app="app"
    />
  </a-modal>
</template>

<style scoped>
:deep(.arco-modal-header) {
  height: auto !important;
  padding: 16px 20px !important;
  border-bottom: 1px solid #f2f3f5 !important;
}

:deep(.arco-modal-title) {
  width: 100%;
}

.app-detail-tabs :deep(.arco-tabs-content) {
  display: none !important;
}

.app-detail-tabs :deep(.arco-tabs-nav) {
  margin-bottom: 0 !important;
}
</style>
