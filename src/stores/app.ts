import {
  useThemeStore,
  useLocaleStore,
  useRoundStore,
  useProjectStore,
} from '@/stores'
import { defineStore } from 'pinia'
import { StaticRound } from '@/api/round-static'

export type AppState = {
  ready: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    ready: false,
  }),
  getters: {},
  actions: {
    async init() {
      useThemeStore()
      const { loadLocale } = useLocaleStore()
      await loadLocale()

      const round = await StaticRound.load()
      const tally = round.getTally()
      const { chainId, operator } = round
      const roundInfo = round.getRoundInfo()
      const leaderboardProjects = round.getLeaderboardProjects()

      const roundStore = useRoundStore()
      roundStore.$patch({
        ...roundInfo,
        tally,
        chainId,
        operator,
        leaderboardProjects,
      })

      const projectStore = useProjectStore()
      projectStore.init(leaderboardProjects || [])
      this.ready = true
    },
    toggleTheme() {
      const themeStore = useThemeStore()
      themeStore.toggleTheme()
    },
  },
})
