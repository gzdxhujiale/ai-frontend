<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { IconCommon, IconDelete, IconEdit } from '@arco-design/web-vue/es/icon'

const teamActivities = [
  { name: 'Beijing ByteDance Technology Co., Ltd.', description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.' },
  { name: 'Beijing ByteDance Technology Co., Ltd.', description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.' },
  { name: 'Beijing ByteDance Technology Co., Ltd.', description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.' },
]
const quickActions = ['性能测试', '稳定性测试', '单元测试', '发布测试', '安全测试', '内存测试', '定时任务', '数据管理', '日志']
const runQuickAction = (action: string) => Message.success({ content: `已开始${action}` })
</script>

<template>
  <div class="dashboard-layout">
    <main class="dashboard-main">
      <a-card class="overview-card" :bordered="false">
        <div class="overview-item"><span>转码时长</span><strong>3735<small>分钟</small></strong></div>
        <div class="overview-item"><span>上行流量</span><strong>124567<small>GB</small></strong></div>
        <div class="overview-item"><span>下行流量</span><strong>24335<small>GB</small></strong></div>
        <div class="overview-item"><span>总览</span><strong>145652<small>GB</small></strong></div>
      </a-card>

      <div class="primary-grid">
        <a-card class="dashboard-card team-card" :bordered="false">
          <template #title>团队动态</template>
          <div v-for="(activity, index) in teamActivities" :key="`${activity.name}-${index}`" class="team-item">
            <a-avatar :size="34" class="team-avatar">BD</a-avatar>
            <div class="team-copy"><strong>{{ activity.name }}</strong><span>{{ activity.description }}</span></div>
            <a-button type="text" class="row-action"><IconEdit /></a-button><a-button type="text" class="row-action danger"><IconDelete /></a-button>
          </div>
          <a-link class="load-more">加载更多⌄</a-link>
        </a-card>
        <a-card class="dashboard-card recent-card" :bordered="false">
          <template #title>最近项目</template><template #extra><a-link>所有项目</a-link></template>
          <div class="project-table"><div class="project-table-row project-table-header"><span>项目名称</span><span>项目团队</span></div><div v-for="index in 4" :key="index" class="project-table-row"><span>{{ index % 2 ? 'Arco Design' : 'Arco Design Team' }}</span><span>{{ index % 2 ? 'Arco Design' : 'Arco Design Team' }}</span></div></div>
        </a-card>
      </div>

      <div class="secondary-grid">
        <a-card class="dashboard-card progress-card" :bordered="false">
          <template #title>项目进度</template>
          <div class="progress-project"><span>Arco Design System</span><a-progress :percent="0.72" /></div>
          <div class="progress-project"><span>Arco Design Pro</span><a-progress :percent="0.48" status="warning" /></div>
        </a-card>
        <a-card class="dashboard-card consumption-card" :bordered="false">
          <template #title>消费记录</template>
          <a-tabs default-active-key="this-month" size="small"><a-tab-pane key="this-month" title="本月"><a-empty description="暂无消费记录" /></a-tab-pane><a-tab-pane key="three-months" title="近三个月"><a-empty description="暂无消费记录" /></a-tab-pane><a-tab-pane key="year" title="近半年"><a-empty description="暂无消费记录" /></a-tab-pane></a-tabs>
        </a-card>
      </div>
    </main>
    <aside class="dashboard-rail">
      <a-card class="dashboard-card quick-card" :bordered="false">
        <template #title>快捷操作</template>
        <div class="quick-grid"><button v-for="action in quickActions" :key="action" type="button" @click="runQuickAction(action)"><span><IconCommon /></span><small>{{ action }}</small></button></div>
      </a-card>
      <div class="feature-visual" aria-label="产品精选展示"><div class="lamp-cord" /><div class="lamp-shade" /><div class="lamp-glow" /></div>
      <a-card class="dashboard-card docs-card" :bordered="false">
        <template #title>文档</template>
        <div class="docs-list"><a-link href="https://pro.arco.design/" target="_blank">ArcoDesign Pro</a-link><a-link href="https://arco.design/themes" target="_blank">ArcoDesign Themes</a-link><a-link href="https://arco.design/material" target="_blank">ArcoDesign Material</a-link><a-link href="https://arco.design/plugins" target="_blank">ArcoDesign Plugins</a-link></div>
      </a-card>
    </aside>
  </div>
</template>
