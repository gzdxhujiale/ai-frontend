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

export function buildMenuGroups(routes: RouteRecordNormalized[], userStore: UserStore, tenantStore: TenantStore) {
  const groups = new Map<string, { key: string; label: string; icon: string; children: { key: string; label: string }[] }>()
  routes
    .filter((route) => (route.meta as unknown as AppRouteMeta).menu && canAccessRoute(route, userStore, tenantStore))
    .sort((a, b) => Number((a.meta as unknown as AppRouteMeta).order ?? 0) - Number((b.meta as unknown as AppRouteMeta).order ?? 0))
    .forEach((route) => {
      const meta = route.meta as unknown as AppRouteMeta
      if (!meta.group || !route.name) return
      if (!groups.has(meta.group)) groups.set(meta.group, { key: meta.group, label: meta.groupTitle ?? meta.group, icon: meta.groupIcon ?? 'apps', children: [] })
      groups.get(meta.group)?.children.push({ key: String(route.name), label: meta.title })
    })
  return [...groups.values()]
}
