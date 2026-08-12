import { defineStore } from 'pinia'

export type AppSpace = 'all' | 'personal' | 'public' | 'rnd' | 'jv'
export type AppRunStatus = 'running' | 'idle' | 'failed' | 'paused'

export interface AppIOField {
  key: string
  label: string
  type: 'text' | 'date' | 'select' | 'multiselect' | 'file' | 'number' | 'boolean'
  required: boolean
  defaultValue?: any
  options?: string[]
  description: string
}

export interface AppTrigger {
  id: string
  type: 'cron' | 'event' | 'webhook' | 'shortcut' | 'manual'
  name: string
  config: string
  enabled: boolean
}

export interface AppVersion {
  version: string
  releaseTime: string
  author: string
  changelog: string
}

export interface AppExecutionLog {
  id: string
  startTime: string
  duration: string
  status: 'success' | 'failed' | 'running'
  triggerSource: string
  logText: string
  outputSummary: string
}

export interface AppPermissionMapping {
  spaces: AppSpace[]
  roles: { role: string; roleName: string; access: 'admin' | 'operator' | 'viewer' }[]
  tenantIds: string[]
}

export interface AppItem {
  id: string
  name: string
  space: AppSpace
  category: string
  tags: string[]
  level: 'L1 原子能力' | 'L2 场景应用' | 'L3 执行系统'
  icon: string
  accent: string
  description: string
  backgroundDoc: string
  requirementsDoc: string
  featureDoc: string
  usageDoc: string
  developer: string
  developerEmail: string
  isOfficial: boolean
  likes: number
  installs: number
  isInstalled: boolean
  isEnabled: boolean
  runStatus: AppRunStatus
  successRate: number
  runsCount: number
  savedPersonDays: string
  costSaved: string
  lastRunResult: string
  lastRunTime: string
  triggers: AppTrigger[]
  inputs: AppIOField[]
  outputs: AppIOField[]
  versions: AppVersion[]
  logs: AppExecutionLog[]
  permissions: AppPermissionMapping
}

const mockApps: AppItem[] = [
  {
    id: 'app-tmall-complaint',
    name: '天猫商家被投诉数据获取',
    space: 'public',
    category: '淘宝',
    tags: ['Agent', 'RPA自动化', '官方推荐'],
    level: 'L2 场景应用',
    icon: 'shopping',
    accent: 'from-rose-500 to-red-600',
    description: '登录天猫商家后台，自动抓取“待处理投诉数据”，提取关键信息，输出至本地 Excel 与分析看板。',
    backgroundDoc: `### 背景介绍
天猫商家后台 - 我被投诉数据获取，业务人员需要登录查看各种投诉信息并进行处理。然而改投诉页面暂不支持数据导出功能，导致客户无法针对投诉数据进行归因分析，人工提取数据耗时高，效率低。`,
    requirementsDoc: `### 需求调研与分析
1. **操作频率**：1 次/日
2. **每次操作时长**：单条数据提取约 15s，每日平均 100+ 条
3. **流程特点**：线性流程，重复性极高，涉及验证码后人机接管与文本规则提取`,
    featureDoc: `### 功能描述
登录天猫商家后台，点击“首页-小儿提醒-待处理投诉数据”进入我被投诉页面，输入时间段查询投诉数据，挨个点击查询结果内每一条投诉数据，进入当前被投诉数据的处理进度页面，获取关键信息，最后写入本地 Excel 文件。`,
    usageDoc: `### 使用说明
> **注意**：官方应用暂不支持二开服务，需要修改内容，请自行查看源码后修改。

1. 点击“运行应用”，弹出**运行对话框**填写查询开始/结束时间、投诉原因。
2. 确认存储 Excel 路径无误后点击确定。
3. 系统将自动唤起浏览器并执行抓取任务。`,
    developer: '天猫数据组 (admin@bigdata)',
    developerEmail: 'admin@bigdata.com',
    isOfficial: true,
    likes: 10,
    installs: 1153,
    isInstalled: true,
    isEnabled: true,
    runStatus: 'idle',
    successRate: 98.5,
    runsCount: 1153,
    savedPersonDays: '45.2 人天',
    costSaved: '¥1,250',
    lastRunResult: '抓取完成 86 条投诉记录',
    lastRunTime: '2026-08-12 11:20:00',
    triggers: [
      { id: 'trig-1', type: 'cron', name: '定时每日抓取', config: '每天 09:00 自动运行', enabled: true },
      { id: 'trig-2', type: 'manual', name: '手动立即触发', config: '点击或快捷键 Shift+F5', enabled: true },
    ],
    inputs: [
      { key: 'startDate', label: '开始申请时间', type: 'date', required: true, defaultValue: '2026-08-01 00:00:00', description: '投诉数据查询的开始时间' },
      { key: 'endDate', label: '结束申请时间', type: 'date', required: true, defaultValue: '2026-08-12 23:59:59', description: '投诉数据查询的结束时间' },
      { key: 'reason', label: '请选择投诉原因', type: 'select', required: false, defaultValue: '全部', options: ['全部', '假冒伪劣', '延迟发货', '描述不符', '服务态度'], description: '按投诉类型进行筛选' },
      { key: 'status', label: '请选择投诉状态', type: 'select', required: false, defaultValue: '全部', options: ['全部', '待举证', '平台审核中', '已完结'], description: '过滤特定处理状态' },
      { key: 'savePath', label: '选择文件保存路径', type: 'file', required: true, defaultValue: 'C:/Exports/Tmall_Complaints.xlsx', description: '抓取结果输出的 Excel 路径' },
    ],
    outputs: [
      { key: 'excelFile', label: '生成 Excel 文件', type: 'file', required: true, description: '包含完整字段的投诉数据表' },
      { key: 'totalCount', label: '解析数据条数', type: 'number', required: true, description: '本次成功提取的记录数' },
    ],
    versions: [
      { version: '版本 7', releaseTime: '2026-08-05 17:34:02', author: 'admin@bigdata', changelog: '下一页的点击方式修改了，适应天猫新版 DOM 结构。' },
      { version: '版本 6', releaseTime: '2026-07-20 13:56:39', author: 'admin@bigdata', changelog: '修复弹窗拦截导致的流程卡顿元素问题。' },
      { version: '版本 5', releaseTime: '2026-05-15 16:58:52', author: 'developer_a', changelog: '优化红包赔付金额计算逻辑与字段对齐。' },
      { version: '版本 1', releaseTime: '2026-01-10 14:36:03', author: 'admin@bigdata', changelog: '用户测试完成，正式上架官方应用。' },
    ],
    logs: [
      { id: 'log-101', startTime: '2026-08-12 11:20:00', duration: '14.8s', status: 'success', triggerSource: '定时任务', logText: '[11:20:00] 启动浏览器环境\n[11:20:03] 登录天猫商家后台成功\n[11:20:08] 检索到 86 条待处理投诉\n[11:20:14] 数据写入 C:/Exports/Tmall_Complaints.xlsx\n[11:20:15] 任务完成！', outputSummary: '成功生成 86 条投诉记录' },
      { id: 'log-100', startTime: '2026-08-11 09:00:00', duration: '15.2s', status: 'success', triggerSource: '定时任务', logText: '[09:00:00] 任务启动...\n[09:00:15] 成功解析 62 条数据', outputSummary: '成功生成 62 条投诉记录' },
      { id: 'log-099', startTime: '2026-08-10 15:30:12', duration: '5.1s', status: 'failed', triggerSource: '手动触发', logText: '[15:30:12] 尝试连接天猫后台...\n[15:30:17] 错误: 页面未响应或被滑块验证码拦截', outputSummary: '运行异常：滑块验证码拦截' },
    ],
    permissions: {
      spaces: ['public', 'rnd'],
      tenantIds: ['bytedance', 'arco'],
      roles: [
        { role: 'super_admin', roleName: '超级管理员', access: 'admin' },
        { role: 'tenant_admin', roleName: '租户管理员', access: 'admin' },
        { role: 'operator', roleName: '业务操作员', access: 'operator' },
        { role: 'viewer', roleName: '普通查看者', access: 'viewer' },
      ],
    },
  },
  {
    id: 'app-amazon-patrol',
    name: '亚马逊店铺绩效巡检',
    space: 'public',
    category: '亚马逊',
    tags: ['Agent', '跨境电商', '官方'],
    level: 'L2 场景应用',
    icon: 'global',
    accent: 'from-amber-500 to-orange-600',
    description: '采集亚马逊店铺关键指标数据汇总 Excel，分区推送异常信息至钉钉/企微，助商家及时避险。',
    backgroundDoc: `### 背景介绍
亚马逊 Seller Central 卖家中心界面分散，包含账户状况、ODR 订单缺陷率、迟发率、政策合规等多个独立模块。跨站点巡检耗费大量精力。`,
    requirementsDoc: `### 需求分析
1. 自动轮询多站点账户健康指标。
2. 超出阈值立刻通过 IM 机器人告警。`,
    featureDoc: `### 功能描述
多账号登录 -> 抓取 Account Health 概览 -> 判断 ODR/LDR 是否触发预警 -> 导出巡检日报 -> IM 机器人推送。`,
    usageDoc: `### 使用说明
配置店铺 API Token 或 RPA 登录凭据后，即可按设定时间定时巡检。`,
    developer: '跨境自动化团队',
    developerEmail: 'crossborder@corp.com',
    isOfficial: true,
    likes: 24,
    installs: 890,
    isInstalled: true,
    isEnabled: true,
    runStatus: 'running',
    successRate: 99.1,
    runsCount: 3420,
    savedPersonDays: '120 人天',
    costSaved: '¥3,800',
    lastRunResult: '巡检 12 个站点，全量正常',
    lastRunTime: '2026-08-12 13:00:00',
    triggers: [
      { id: 'trig-amz-1', type: 'cron', name: '每 2 小时巡检', config: '0 */2 * * *', enabled: true },
    ],
    inputs: [
      { key: 'stores', label: '巡检店铺列表', type: 'text', required: true, defaultValue: 'US-Store-1, EU-Store-2', description: '输入需要巡检的店铺标识' },
      { key: 'odrThreshold', label: 'ODR 警戒线 (%)', type: 'number', required: true, defaultValue: 1.0, description: '订单缺陷率超过此设定值告警' },
    ],
    outputs: [
      { key: 'report', label: '巡检报告 PDF', type: 'file', required: true, description: '多站点健康度的合规摘要' },
    ],
    versions: [
      { version: 'v2.1', releaseTime: '2026-07-10 10:00:00', author: 'crossborder', changelog: '支持日本站与中东站绩效抓取。' },
    ],
    logs: [
      { id: 'log-amz-1', startTime: '2026-08-12 13:00:00', duration: '22s', status: 'success', triggerSource: '定时巡检', logText: '[13:00:00] 开始巡检 12 个站点...\n[13:00:22] 全部指标处于安全阈值内。', outputSummary: '巡检完成，状态正常' },
    ],
    permissions: {
      spaces: ['public', 'jv'],
      tenantIds: ['bytedance'],
      roles: [
        { role: 'super_admin', roleName: '超级管理员', access: 'admin' },
        { role: 'operator', roleName: '业务操作员', access: 'operator' },
      ],
    },
  },
  {
    id: 'app-compete-monitor',
    name: '供应商与竞店上新监测',
    space: 'rnd',
    category: '商品',
    tags: ['Agent', '竞品分析'],
    level: 'L2 场景应用',
    icon: 'monitor',
    accent: 'from-blue-500 to-cyan-500',
    description: '自动监测目标竞店上新，完成聚合、分析并生成跟进建议与价格对比策略。',
    backgroundDoc: `### 背景与目的
帮助商品开发与采购部门第一时间掌握行业主推款式与定价变动。`,
    requirementsDoc: `每日定时抓取指定店铺新品列表，对比已有 SKU。`,
    featureDoc: `抓取商品图文、主图、价格、销量趋势，基于大模型分析设计风格与卖点。`,
    usageDoc: `配置监测店铺 URL 列表，运行后生成分析报告。`,
    developer: '研发中心 AI 组',
    developerEmail: 'rd-ai@corp.com',
    isOfficial: false,
    likes: 18,
    installs: 412,
    isInstalled: true,
    isEnabled: true,
    runStatus: 'idle',
    successRate: 97.8,
    runsCount: 186,
    savedPersonDays: '42.5 人天',
    costSaved: '¥980',
    lastRunResult: '发现 12 个同款跟进点',
    lastRunTime: '2026-08-12 08:00:00',
    triggers: [
      { id: 'trig-comp-1', type: 'cron', name: '每日早报', config: '0 8 * * *', enabled: true },
    ],
    inputs: [
      { key: 'targetUrls', label: '竞店地址', type: 'text', required: true, defaultValue: 'https://shop123.taobao.com', description: '监测的目标店铺首页' },
    ],
    outputs: [
      { key: 'insightSummary', label: '竞品情报摘要', type: 'text', required: true, description: 'AI 总结的流行趋势分析' },
    ],
    versions: [
      { version: 'v1.2', releaseTime: '2026-06-01 09:00:00', author: 'rd-ai', changelog: '增加样式标签大模型自动标注。' },
    ],
    logs: [
      { id: 'log-comp-1', startTime: '2026-08-12 08:00:00', duration: '35s', status: 'success', triggerSource: '定时任务', logText: '[08:00:00] 正在请求竞店接口...\n[08:08:35] 完成趋势分析。', outputSummary: '解析 12 款新品' },
    ],
    permissions: {
      spaces: ['rnd'],
      tenantIds: ['bytedance', 'arco'],
      roles: [
        { role: 'super_admin', roleName: '超级管理员', access: 'admin' },
        { role: 'operator', roleName: '业务操作员', access: 'operator' },
      ],
    },
  },
  {
    id: 'app-contract-audit',
    name: '合同审查专家',
    space: 'personal',
    category: '财务',
    tags: ['Agent', 'AI助手', '模板示例'],
    level: 'L2 场景应用',
    icon: 'file-text',
    accent: 'from-violet-500 to-purple-600',
    description: '上传合同文件，基于大模型自动进行合同条款合规审查、风险避坑提示与修改建议。',
    backgroundDoc: `### 背景
法务与业务人员审批合同工作量大，容易遗漏履约风险或违约金陷阱。`,
    requirementsDoc: `支持 PDF/Word 文件上传，识别付款节点、免责声明与争议解决条款。`,
    featureDoc: `多维度法律模型对比，高亮高风险条款并给出替代建议。`,
    usageDoc: `直接拖拽合同文件至运行框，点击开始审查。`,
    developer: '法务科技部',
    developerEmail: 'legal-tech@corp.com',
    isOfficial: true,
    likes: 45,
    installs: 2100,
    isInstalled: false,
    isEnabled: false,
    runStatus: 'idle',
    successRate: 99.5,
    runsCount: 5400,
    savedPersonDays: '210 人天',
    costSaved: '¥8,500',
    lastRunResult: '未运行',
    lastRunTime: '--',
    triggers: [
      { id: 'trig-contract-1', type: 'manual', name: '手动点击运行', config: '文件上传触发', enabled: true },
    ],
    inputs: [
      { key: 'contractFile', label: '上传合同文件', type: 'file', required: true, defaultValue: '', description: '支持 .pdf, .docx 格式文件' },
      { key: 'strictLevel', label: '审查严格度', type: 'select', required: true, defaultValue: '标准', options: ['宽松', '标准', '严格'], description: '风险合规偏好' },
    ],
    outputs: [
      { key: 'riskReport', label: '风险审查诊断书', type: 'text', required: true, description: '包含风险清单与修改意见' },
    ],
    versions: [
      { version: 'v3.0', releaseTime: '2026-08-01 14:00:00', author: 'legal-tech', changelog: '升级新一代企业法务模型引擎。' },
    ],
    logs: [],
    permissions: {
      spaces: ['personal', 'public'],
      tenantIds: ['bytedance', 'arco', 'demo'],
      roles: [
        { role: 'super_admin', roleName: '超级管理员', access: 'admin' },
        { role: 'operator', roleName: '业务操作员', access: 'operator' },
        { role: 'viewer', roleName: '查看者', access: 'viewer' },
      ],
    },
  },
  {
    id: 'app-voice-assistant',
    name: '智能语音指令助手',
    space: 'jv',
    category: '客服',
    tags: ['Agent', '语音交互'],
    level: 'L1 原子能力',
    icon: 'sound',
    accent: 'from-pink-500 to-rose-500',
    description: '长按 Space 空格键进行语音输入，松开即可发送语音指令，机器人回复自带语音合成。',
    backgroundDoc: `### 背景
提高移动端与桌面端交互效率，解放双手。`,
    requirementsDoc: `低延迟语音识别 (ASR) 与合成 (TTS)。`,
    featureDoc: `支持实时流式识别与快捷指令触发。`,
    usageDoc: `按住快捷键说话即可。`,
    developer: 'AI 交互实验室',
    developerEmail: 'speech@corp.com',
    isOfficial: true,
    likes: 31,
    installs: 670,
    isInstalled: false,
    isEnabled: false,
    runStatus: 'idle',
    successRate: 96.2,
    runsCount: 1200,
    savedPersonDays: '15 人天',
    costSaved: '¥450',
    lastRunResult: '未运行',
    lastRunTime: '--',
    triggers: [
      { id: 'trig-voice-1', type: 'shortcut', name: '长按空格', config: 'Space Keydown', enabled: true },
    ],
    inputs: [
      { key: 'language', label: '识别语言', type: 'select', required: true, defaultValue: '中文普通话', options: ['中文普通话', '英语', '粤语'], description: '主音频采样语言' },
    ],
    outputs: [
      { key: 'textResult', label: '识别文本', type: 'text', required: true, description: '语音转出的文本' },
    ],
    versions: [
      { version: 'v1.0', releaseTime: '2026-05-10 11:00:00', author: 'speech', changelog: '首次上架。' },
    ],
    logs: [],
    permissions: {
      spaces: ['jv', 'public'],
      tenantIds: ['bytedance'],
      roles: [
        { role: 'super_admin', roleName: '超级管理员', access: 'admin' },
      ],
    },
  },
]

export const useAppCenterStore = defineStore('appCenter', {
  state: () => ({
    apps: mockApps as AppItem[],
    selectedAppId: null as string | null,
    detailModalVisible: false,
    createModalVisible: false,
    interactiveDialogVisible: false,
    activeTabInDetail: 'overview', // 'overview' | 'config' | 'triggers' | 'versions' | 'logs' | 'permissions'
  }),

  getters: {
    selectedApp: (state) => state.apps.find((app) => app.id === state.selectedAppId) ?? null,
    installedAppsCount: (state) => state.apps.filter((app) => app.isInstalled).length,
    activeRunningAppsCount: (state) => state.apps.filter((app) => app.runStatus === 'running').length,
    totalSavedPersonDays: (state) => {
      let total = 0
      state.apps.forEach((app) => {
        const val = parseFloat(app.savedPersonDays) || 0
        total += val
      })
      return total.toFixed(1)
    },
  },

  actions: {
    openDetail(appId: string, tab = 'overview') {
      this.selectedAppId = appId
      this.activeTabInDetail = tab
      this.detailModalVisible = true
    },

    closeDetail() {
      this.detailModalVisible = false
    },

    toggleInstall(appId: string) {
      const app = this.apps.find((a) => a.id === appId)
      if (!app) return
      app.isInstalled = !app.isInstalled
      if (app.isInstalled) {
        app.isEnabled = true
        app.installs += 1
      } else {
        app.isEnabled = false
      }
    },

    toggleEnable(appId: string) {
      const app = this.apps.find((a) => a.id === appId)
      if (!app) return
      app.isEnabled = !app.isEnabled
    },

    setRunStatus(appId: string, status: AppRunStatus) {
      const app = this.apps.find((a) => a.id === appId)
      if (!app) return
      app.runStatus = status
    },

    runAppNow(appId: string, inputValues: Record<string, any>) {
      const app = this.apps.find((a) => a.id === appId)
      if (!app) return

      app.runStatus = 'running'
      const newLogId = `log-${Date.now().toString().slice(-4)}`
      const nowStr = new Date().toLocaleString()

      const newLog: AppExecutionLog = {
        id: newLogId,
        startTime: nowStr,
        duration: '正在计算...',
        status: 'running',
        triggerSource: '手动运行对话框',
        logText: `[${nowStr}] 交互框传参: ${JSON.stringify(inputValues)}\n[${nowStr}] 唤起自动化执行引擎...\n[${nowStr}] 正在处理应用逻辑中...`,
        outputSummary: '运行中',
      }

      app.logs.unshift(newLog)

      // Simulate completion after 2.5 seconds
      setTimeout(() => {
        newLog.status = 'success'
        newLog.duration = '2.8s'
        newLog.logText += `\n[${new Date().toLocaleString()}] 执行成功！返回结果与参数写回完毕。`
        newLog.outputSummary = '本次模拟手动执行成功'

        app.runStatus = 'idle'
        app.runsCount += 1
        app.lastRunTime = nowStr
        app.lastRunResult = '已完成本次交互执行'
      }, 2500)
    },

    addApp(newApp: Partial<AppItem>) {
      const id = `app-custom-${Date.now()}`
      const fullApp: AppItem = {
        id,
        name: newApp.name || '新建自动化应用',
        space: newApp.space || 'personal',
        category: newApp.category || '营销',
        tags: newApp.tags || ['自建应用'],
        level: newApp.level || 'L2 场景应用',
        icon: newApp.icon || 'ai',
        accent: newApp.accent || 'from-[#165dff] to-[#7b61ff]',
        description: newApp.description || '用户新建的自动化场景应用',
        backgroundDoc: newApp.backgroundDoc || '### 背景介绍\n无',
        requirementsDoc: newApp.requirementsDoc || '### 需求分析\n无',
        featureDoc: newApp.featureDoc || '### 功能描述\n无',
        usageDoc: newApp.usageDoc || '### 使用说明\n无',
        developer: '当前用户',
        developerEmail: 'user@corp.com',
        isOfficial: false,
        likes: 1,
        installs: 1,
        isInstalled: true,
        isEnabled: true,
        runStatus: 'idle',
        successRate: 100,
        runsCount: 0,
        savedPersonDays: '0 人天',
        costSaved: '¥0',
        lastRunResult: '就绪未运行',
        lastRunTime: '--',
        triggers: [
          { id: `trig-${Date.now()}`, type: 'manual', name: '手动触发', config: '点击运行按钮', enabled: true },
        ],
        inputs: [
          { key: 'input_param', label: '默认输入参数', type: 'text', required: true, defaultValue: '测试文本', description: '参数说明' },
        ],
        outputs: [
          { key: 'output_param', label: '默认输出结果', type: 'text', required: true, description: '输出结果说明' },
        ],
        versions: [
          { version: 'v1.0.0', releaseTime: new Date().toLocaleString(), author: '当前用户', changelog: '首次创建应用' },
        ],
        logs: [],
        permissions: {
          spaces: [newApp.space || 'personal'],
          tenantIds: ['bytedance'],
          roles: [
            { role: 'super_admin', roleName: '超级管理员', access: 'admin' },
            { role: 'operator', roleName: '业务操作员', access: 'operator' },
          ],
        },
      }
      this.apps.unshift(fullApp)
      return id
    },
  },
})
