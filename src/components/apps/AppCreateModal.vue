<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { useAppCenterStore } from '../../stores/appCenter'
import type { AppSpace } from '../../stores/appCenter'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

const appStore = useAppCenterStore()
const activeTab = ref<'template' | 'blank'>('template')

const templates = [
  { title: '招聘助手', tag: 'HR/Agent', desc: '上传 JD 与简历，自动匹配岗位需求并输出评价多维报告。', space: 'public', category: '人事', level: 'L2 场景应用' as const, accent: 'from-amber-500 to-orange-500' },
  { title: '合同审查专家', tag: '法务AI', desc: '上传合同文件，自动进行合规审查、风险避坑与修改建议。', space: 'personal', category: '财务', level: 'L2 场景应用' as const, accent: 'from-violet-500 to-purple-500' },
  { title: '智能语音助手', tag: '语音/RPA', desc: '按住 Space 空格键语音输入，自动抓取指令并语音合成回复。', space: 'jv', category: '客服', level: 'L1 原子能力' as const, accent: 'from-pink-500 to-rose-500' },
  { title: '模板生成表格', tag: '数据/Excel', desc: '上传 Excel 模板，自动提取表头与补全字段并生成新报表。', space: 'public', category: '财务', level: 'L2 场景应用' as const, accent: 'from-blue-500 to-indigo-500' },
  { title: '知识库问答机器人', tag: 'Agent', desc: '引用关联知识库内容，根据用户问题深度检索解答。', space: 'rnd', category: '营销', level: 'L2 场景应用' as const, accent: 'from-emerald-500 to-teal-500' },
  { title: '竞店上新巡检', tag: '电商/抓取', desc: '每日自动定时抓取竞店商品更新，生成对比情报。', space: 'public', category: '商品', level: 'L2 场景应用' as const, accent: 'from-cyan-500 to-blue-600' },
]

const formModel = reactive({
  name: '',
  category: '商品',
  space: 'personal' as AppSpace,
  level: 'L2 场景应用' as 'L1 原子能力' | 'L2 场景应用' | 'L3 执行系统',
  description: '',
})

const handleClose = () => emit('update:visible', false)

const handleUseTemplate = (tpl: typeof templates[0]) => {
  const newId = appStore.addApp({
    name: tpl.title,
    category: tpl.category,
    space: tpl.space as AppSpace,
    level: tpl.level,
    accent: tpl.accent,
    description: tpl.desc,
    tags: [tpl.tag, '模板导入'],
  })
  Message.success({ content: `成功基于模板创建 [${tpl.title}]！` })
  handleClose()
  appStore.openDetail(newId, 'overview')
}

const handleCreateBlank = () => {
  if (!formModel.name.trim()) {
    Message.warning({ content: '请输入应用名称' })
    return
  }
  const newId = appStore.addApp({
    name: formModel.name,
    category: formModel.category,
    space: formModel.space,
    level: formModel.level,
    description: formModel.description || '用户新建的自定义自动化应用',
  })
  Message.success({ content: `应用 [${formModel.name}] 创建成功！` })
  handleClose()
  appStore.openDetail(newId, 'overview')
}
</script>

<template>
  <a-modal
    :visible="visible"
    :footer="false"
    :unmount-on-close="true"
    :width="760"
    class="shadow-2xl rounded-2xl"
    @cancel="handleClose"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <span class="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-[#165dff]">
          <IconPlus />
        </span>
        <span class="font-bold text-slate-800 text-base">创建新应用</span>
      </div>
    </template>

    <div class="p-1 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-1">
        <a-tabs v-model:active-key="activeTab" type="line" size="medium" class="app-detail-tabs">
          <a-tab-pane key="template" title="使用应用模板" />
          <a-tab-pane key="blank" title="创建空白应用" />
        </a-tabs>
        <span class="text-xs text-slate-400">选择适合你的构建方式</span>
      </div>

      <!-- Tab 1: Template Selection -->
      <div v-if="activeTab === 'template'" class="grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
        <div
          v-for="tpl in templates"
          :key="tpl.title"
          class="group rounded-xl border border-slate-200/80 bg-white p-4 transition duration-200 hover:border-blue-300 hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="font-semibold text-slate-800 text-sm group-hover:text-[#165dff] transition">{{ tpl.title }}</span>
              <a-tag size="small" color="arcoblue">{{ tpl.tag }}</a-tag>
            </div>
            <p class="text-xs leading-5 text-slate-500 min-h-10 mb-3">{{ tpl.desc }}</p>
          </div>
          <div class="flex items-center justify-between border-t border-slate-100 pt-3">
            <span class="text-[11px] text-slate-400">{{ tpl.level }}</span>
            <a-button type="primary" size="mini" class="!rounded-[2px]" @click="handleUseTemplate(tpl)">
              创建应用
            </a-button>
          </div>
        </div>
      </div>

      <!-- Tab 2: Blank Form -->
      <div v-else class="space-y-4 py-2">
        <a-form :model="formModel" layout="vertical">
          <a-form-item label="应用名称" required>
            <a-input v-model="formModel.name" placeholder="请输入应用名称，例如：店铺财务对账机器人" class="minimal-radius !rounded-[2px]" />
          </a-form-item>

          <div class="grid grid-cols-3 gap-3">
            <a-form-item label="所属空间">
              <a-select v-model="formModel.space" class="minimal-radius !rounded-[2px]">
                <a-option value="personal">个人空间</a-option>
                <a-option value="public">公共空间</a-option>
                <a-option value="rnd">研发中心</a-option>
                <a-option value="jv">合资企业</a-option>
              </a-select>
            </a-form-item>

            <a-form-item label="业务分类">
              <a-select v-model="formModel.category" class="minimal-radius !rounded-[2px]">
                <a-option value="商品">商品</a-option>
                <a-option value="淘宝">淘宝</a-option>
                <a-option value="亚马逊">亚马逊</a-option>
                <a-option value="财务">财务</a-option>
                <a-option value="客服">客服</a-option>
                <a-option value="人事">人事</a-option>
                <a-option value="营销">营销</a-option>
              </a-select>
            </a-form-item>

            <a-form-item label="应用层级">
              <a-select v-model="formModel.level" class="minimal-radius !rounded-[2px]">
                <a-option value="L1 原子能力">L1 原子能力</a-option>
                <a-option value="L2 场景应用">L2 场景应用</a-option>
                <a-option value="L3 执行系统">L3 执行系统</a-option>
              </a-select>
            </a-form-item>
          </div>

          <a-form-item label="应用描述说明">
            <a-textarea v-model="formModel.description" placeholder="简要描述该自动化的核心业务功能与使用对象..." :auto-size="{ minRows: 3, maxRows: 5 }" class="minimal-radius !rounded-[2px]" />
          </a-form-item>
        </a-form>

        <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <a-button class="!rounded-[2px]" @click="handleClose">取消</a-button>
          <a-button type="primary" class="!rounded-[2px] !px-6" @click="handleCreateBlank">立即创建</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>
