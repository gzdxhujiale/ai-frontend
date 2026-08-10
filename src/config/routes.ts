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
  { path: '/workspace', name: 'workbench', component: () => import('../views/WorkspaceView.vue'), meta: { title: '我的工作台', menu: true, groupIcon: 'dashboard', order: 1 } satisfies AppRouteMeta },
  { path: '/tasks', name: 'tasks', component: () => import('../views/PlaceholderView.vue'), meta: { title: '任务中心', menu: true, groupIcon: 'list', order: 2 } satisfies AppRouteMeta },
  { path: '/apps', name: 'apps', component: () => import('../views/PlaceholderView.vue'), meta: { title: '应用中心', menu: true, groupIcon: 'apps', order: 3 } satisfies AppRouteMeta },
  { path: '/business-map', name: 'business-map', component: () => import('../views/PlaceholderView.vue'), meta: { title: '经营地图', menu: true, groupIcon: 'file', order: 4 } satisfies AppRouteMeta },
  { path: '/business-insights', name: 'business-insights', component: () => import('../views/PlaceholderView.vue'), meta: { title: '经营洞察', menu: true, groupIcon: 'result', order: 5 } satisfies AppRouteMeta },
  { path: '/ai-upgrade', name: 'ai-upgrade', component: () => import('../views/PlaceholderView.vue'), meta: { title: 'AI升级', menu: true, groupIcon: 'apps', order: 6 } satisfies AppRouteMeta },
  { path: '/enterprise-settings', name: 'enterprise-settings', component: () => import('../views/PlaceholderView.vue'), meta: { title: '企业设置', menu: true, groupIcon: 'settings', order: 7 } satisfies AppRouteMeta },
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
