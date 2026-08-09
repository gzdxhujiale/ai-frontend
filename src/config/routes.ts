import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { IconApps, IconCheckCircle, IconDashboard, IconFile, IconOrderedList, IconSettings } from '@arco-design/web-vue/es/icon'

export type UserRole = 'super_admin' | 'tenant_admin' | 'editor' | 'viewer'
export type Permission = 'dashboard:view' | 'monitor:view' | 'projects:view' | 'projects:edit' | 'forms:edit' | 'analytics:view' | 'analytics:advanced' | 'documents:view' | 'settings:view' | 'tenants:manage'

export interface AppRouteMeta {
  title: string
  menu?: boolean
  group?: string
  groupTitle?: string
  groupIcon?: string
  order?: number
  roles?: UserRole[]
  permissions?: Permission[]
  tenantScoped?: boolean
}

export const routeRecords: RouteRecordRaw[] = [
  { path: '/', redirect: '/workspace' },
  { path: '/workspace', name: 'workbench', component: () => import('../views/WorkspaceView.vue'), meta: { title: '工作台', menu: true, group: 'dashboard', groupTitle: '仪表盘', groupIcon: 'dashboard', order: 1, permissions: ['dashboard:view'] } satisfies AppRouteMeta },
  { path: '/monitor', name: 'monitor', component: () => import('../views/PlaceholderView.vue'), meta: { title: '实时监控', menu: true, group: 'dashboard', groupTitle: '仪表盘', groupIcon: 'dashboard', order: 2, permissions: ['monitor:view'] } satisfies AppRouteMeta },
  { path: '/search-table', name: 'search-table', component: () => import('../views/PlaceholderView.vue'), meta: { title: '查询表格', menu: true, group: 'list', groupTitle: '列表页', groupIcon: 'list', order: 1, permissions: ['projects:view'] } satisfies AppRouteMeta },
  { path: '/card-list', name: 'card-list', component: () => import('../views/PlaceholderView.vue'), meta: { title: '卡片列表', menu: true, group: 'list', groupTitle: '列表页', groupIcon: 'list', order: 2, permissions: ['projects:view'] } satisfies AppRouteMeta },
  { path: '/step-form', name: 'step-form', component: () => import('../views/PlaceholderView.vue'), meta: { title: '分步表单', menu: true, group: 'forms', groupTitle: '表单页', groupIcon: 'settings', order: 1, permissions: ['forms:edit'] } satisfies AppRouteMeta },
  { path: '/group-form', name: 'group-form', component: () => import('../views/PlaceholderView.vue'), meta: { title: '分组表单', menu: true, group: 'forms', groupTitle: '表单页', groupIcon: 'settings', order: 2, permissions: ['forms:edit'] } satisfies AppRouteMeta },
  { path: '/basic-detail', name: 'basic-detail', component: () => import('../views/PlaceholderView.vue'), meta: { title: '基础详情页', menu: true, group: 'detail', groupTitle: '详情页', groupIcon: 'file', order: 1, permissions: ['documents:view'] } satisfies AppRouteMeta },
  { path: '/analysis', name: 'analysis', component: () => import('../views/PlaceholderView.vue'), meta: { title: '分析页', menu: true, group: 'visualization', groupTitle: '数据可视化', groupIcon: 'apps', order: 1, permissions: ['analytics:view'] } satisfies AppRouteMeta },
  { path: '/multi-analysis', name: 'multi-analysis', component: () => import('../views/PlaceholderView.vue'), meta: { title: '多维数据分析', menu: true, group: 'visualization', groupTitle: '数据可视化', groupIcon: 'apps', order: 2, permissions: ['analytics:advanced'], roles: ['super_admin', 'tenant_admin'] } satisfies AppRouteMeta },
  { path: '/success', name: 'success', component: () => import('../views/PlaceholderView.vue'), meta: { title: '成功页', menu: true, group: 'result', groupTitle: '结果页', groupIcon: 'result', order: 1, permissions: ['dashboard:view'] } satisfies AppRouteMeta },
  { path: '/failure', name: 'failure', component: () => import('../views/PlaceholderView.vue'), meta: { title: '失败页', menu: true, group: 'result', groupTitle: '结果页', groupIcon: 'result', order: 2, permissions: ['dashboard:view'] } satisfies AppRouteMeta },
  { path: '/settings', name: 'settings', component: () => import('../views/PlaceholderView.vue'), meta: { title: '系统设置', menu: true, group: 'system', groupTitle: '系统管理', groupIcon: 'settings', order: 1, roles: ['super_admin', 'tenant_admin'], permissions: ['settings:view'], tenantScoped: true } satisfies AppRouteMeta },
  { path: '/tenant-settings', name: 'tenant-settings', component: () => import('../views/PlaceholderView.vue'), meta: { title: '租户管理', menu: true, group: 'system', groupTitle: '系统管理', groupIcon: 'settings', order: 2, roles: ['super_admin'], permissions: ['tenants:manage'] } satisfies AppRouteMeta },
  { path: '/forbidden', name: 'forbidden', component: () => import('../views/ForbiddenView.vue'), meta: { title: '无权访问' } satisfies AppRouteMeta },
]

export const menuIconMap: Record<string, Component> = {
  dashboard: IconDashboard,
  list: IconOrderedList,
  settings: IconSettings,
  file: IconFile,
  apps: IconApps,
  result: IconCheckCircle,
}
