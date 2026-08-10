import type { RouteRecordNormalized } from 'vue-router'
import type { AppRouteMeta } from '../config/routes'
import type { useTenantStore } from '../stores/tenant'
import type { useUserStore } from '../stores/user'

type UserStore = ReturnType<typeof useUserStore>
type TenantStore = ReturnType<typeof useTenantStore>

export function canAccessRoute(route: { meta: unknown }, userStore: UserStore, tenantStore: TenantStore) {
  const meta = route.meta as AppRouteMeta
  const roles = userStore.rolesForTenant(tenantStore.currentTenantId)
  const permissions = userStore.permissionsForTenant(tenantStore.currentTenantId)
  if (meta.roles?.length && !meta.roles.some((role) => roles.includes(role))) return false
  if (meta.permissions?.length && !meta.permissions.every((permission) => permissions.includes(permission))) return false
  return true
}

export function buildMenuItems(routes: RouteRecordNormalized[], userStore: UserStore, tenantStore: TenantStore) {
  return routes
    .filter((route) => (route.meta as unknown as AppRouteMeta).menu && canAccessRoute(route, userStore, tenantStore))
    .sort((a, b) => Number((a.meta as unknown as AppRouteMeta).order ?? 0) - Number((b.meta as unknown as AppRouteMeta).order ?? 0))
    .flatMap((route) => {
      const meta = route.meta as unknown as AppRouteMeta
      if (!route.name) return []
      return [{ key: String(route.name), label: meta.title, icon: meta.groupIcon ?? 'apps' }]
    })
}
