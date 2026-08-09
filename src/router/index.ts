import { createRouter, createWebHistory } from 'vue-router'
import { routeRecords } from '../config/routes'
import { useTenantStore } from '../stores/tenant'
import { useUserStore } from '../stores/user'
import { canAccessRoute } from '../utils/permission'

export const router = createRouter({
  history: createWebHistory(),
  routes: routeRecords,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const tenantStore = useTenantStore()
  if (to.name !== 'forbidden' && !canAccessRoute(to, userStore, tenantStore)) {
    return { name: 'forbidden', query: { from: String(to.name ?? '') } }
  }
  return true
})
