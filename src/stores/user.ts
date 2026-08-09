import { defineStore } from 'pinia'
import type { Permission, UserRole } from '../config/routes'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '王立群',
    email: 'wangliqun@email.com',
    rolesByTenant: {
      bytedance: ['super_admin', 'tenant_admin'] as UserRole[],
      arco: ['tenant_admin', 'editor'] as UserRole[],
      demo: ['viewer'] as UserRole[],
    } as Record<string, UserRole[]>,
    permissionsByTenant: {
      bytedance: ['dashboard:view', 'monitor:view', 'projects:view', 'projects:edit', 'forms:edit', 'analytics:view', 'analytics:advanced', 'documents:view', 'settings:view', 'tenants:manage'] as Permission[],
      arco: ['dashboard:view', 'monitor:view', 'projects:view', 'projects:edit', 'forms:edit', 'analytics:view', 'documents:view', 'settings:view'] as Permission[],
      demo: ['dashboard:view', 'monitor:view', 'projects:view', 'documents:view'] as Permission[],
    } as Record<string, Permission[]>,
  }),
  getters: {
    rolesForTenant: (state) => (tenantId: string) => state.rolesByTenant[tenantId] ?? [],
    permissionsForTenant: (state) => (tenantId: string) => state.permissionsByTenant[tenantId] ?? [],
  },
})
