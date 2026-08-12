import { defineStore } from 'pinia'

export interface Tenant {
  id: string
  name: string
  plan: string
  color: string
}

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    currentTenantId: 'bytedance',
    tenants: [
      { id: 'bytedance', name: '临川科技', plan: '企业版', color: '#165dff' },
      { id: 'arco', name: 'Arco Design Team', plan: '专业版', color: '#14c9c9' },
      { id: 'demo', name: '体验租户', plan: '试用版', color: '#ff7d00' },
    ] as Tenant[],
  }),
  getters: {
    currentTenant: (state) => state.tenants.find((tenant) => tenant.id === state.currentTenantId) ?? state.tenants[0],
  },
  actions: {
    switchTenant(tenantId: string) {
      if (this.tenants.some((tenant) => tenant.id === tenantId)) this.currentTenantId = tenantId
    },
  },
})
