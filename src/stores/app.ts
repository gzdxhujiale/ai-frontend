import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false,
    darkMode: false,
    language: '中文',
  }),
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    toggleLanguage() {
      this.language = this.language === '中文' ? 'English' : '中文'
    },
  },
})
