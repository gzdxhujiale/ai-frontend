import { defineStore } from 'pinia'

export type DemoRole = 'operator' | 'manager' | 'employee'

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: false,
    demoRole: 'operator' as DemoRole,
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    setDemoRole(role: DemoRole) {
      this.demoRole = role
    },
  },
})
