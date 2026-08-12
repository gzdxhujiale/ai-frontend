<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconFolder, IconInfoCircle, IconPlayArrow } from '@arco-design/web-vue/es/icon'
import { useAppCenterStore } from '../../stores/appCenter'
import type { AppItem } from '../../stores/appCenter'

const props = defineProps<{
  app: AppItem | null
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'run', values: Record<string, any>): void
}>()

const appStore = useAppCenterStore()
const formValues = reactive<Record<string, any>>({})
const rememberValues = ref(true)

// Initialize form values from app.inputs defaults
watch(
  () => props.app,
  (newApp) => {
    if (!newApp) return
    Object.keys(formValues).forEach((key) => delete formValues[key])
    newApp.inputs.forEach((field) => {
      formValues[field.key] = field.defaultValue ?? ''
    })
  },
  { immediate: true },
)

const handleClose = () => {
  emit('update:visible', false)
}

const handleBrowseFile = (fieldKey: string) => {
  const samplePath = `C:/Users/Public/Documents/${props.app?.name || 'Task'}_Export_${Date.now().toString().slice(-4)}.xlsx`
  formValues[fieldKey] = samplePath
  Message.success({ content: '已选择模拟路径: ' + samplePath })
}

const handleSubmit = () => {
  if (!props.app) return
  // validate required fields
  for (const field of props.app.inputs) {
    if (field.required && (formValues[field.key] === undefined || formValues[field.key] === '')) {
      Message.warning({ content: `请填写必填项: ${field.label}` })
      return
    }
  }

  Message.success({ content: `[${props.app.name}] 运行对话框确认，已投递运行流程！` })
  appStore.runAppNow(props.app.id, { ...formValues })
  emit('run', { ...formValues })
  handleClose()
}
</script>

<template>
  <a-modal
    :visible="visible"
    :footer="false"
    :unmount-on-close="true"
    :mask-closable="true"
    :width="540"
    class="shadow-2xl rounded-2xl"
    @cancel="handleClose"
  >
    <template #title>
      <div class="flex items-center gap-2.5">
        <span class="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          <IconPlayArrow />
        </span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400 font-normal">{{ app?.name }}</span>
        </div>
      </div>
    </template>

    <div class="p-1 space-y-4">
      <div class="rounded-xl border border-amber-100 bg-amber-50/60 p-3 text-xs text-amber-800 flex items-start gap-2">
        <IconInfoCircle class="mt-0.5 shrink-0 text-amber-600 text-sm" />
        <div>
          <span>提示：确认参数后点击运行将唤起引擎执行流程。</span>
        </div>
      </div>

      <a-form :model="formValues" layout="vertical">
        <template v-for="field in app?.inputs" :key="field.key">
          <a-form-item
            :field="field.key"
            :label="field.label"
            :required="field.required"
            class="!mb-3"
          >
            <!-- Date Picker -->
            <a-date-picker
              v-if="field.type === 'date'"
              v-model="formValues[field.key]"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :time-picker-props="{ format: 'HH:mm:ss' }"
              class="w-full !rounded-lg"
              placeholder="请选择时间"
            />

            <!-- Select / MultiSelect -->
            <a-select
              v-else-if="field.type === 'select'"
              v-model="formValues[field.key]"
              class="w-full !rounded-lg"
              placeholder="请选择"
            >
              <a-option v-for="opt in field.options || []" :key="opt" :value="opt">{{ opt }}</a-option>
            </a-select>

            <!-- File Selector -->
            <div v-else-if="field.type === 'file'" class="flex w-full gap-2">
              <a-input
                v-model="formValues[field.key]"
                placeholder="请选择数据存放路径..."
                class="flex-1 !rounded-lg"
              />
              <a-button type="secondary" class="!rounded-lg" @click="handleBrowseFile(field.key)">
                <template #icon><IconFolder /></template>
                浏览...
              </a-button>
            </div>

            <!-- Number -->
            <a-input-number
              v-else-if="field.type === 'number'"
              v-model="formValues[field.key]"
              class="w-full !rounded-lg"
              placeholder="请输入数字"
            />

            <!-- Default Text -->
            <a-input
              v-else
              v-model="formValues[field.key]"
              class="w-full !rounded-lg"
              :placeholder="field.description || '请输入'"
            />
          </a-form-item>
        </template>
      </a-form>

      <div class="flex items-center justify-between border-t border-slate-100 pt-4">
        <a-checkbox v-model="rememberValues" class="text-xs text-slate-500">记住内容</a-checkbox>
        <div class="flex gap-2">
          <a-button class="!rounded-lg !px-5" @click="handleClose">取消</a-button>
          <a-button type="primary" class="!rounded-lg !bg-rose-500 hover:!bg-rose-600 !px-6" @click="handleSubmit">
            <template #icon><IconPlayArrow /></template>
            确定运行
          </a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>
