import { defineStore } from 'pinia'
import type { LeaderboardProject } from '@/api/projects'

interface ProjectRecords {
  [key: string]: LeaderboardProject
}

interface ProjectState {
  projects: ProjectRecords
  ready: boolean
}

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    ready: false,
    projects: {},
  }),
  getters: {
    getProject(state) {
      return (projectId: string): LeaderboardProject | undefined => {
        return state.projects[projectId]
      }
    },
  },
  actions: {
    init(projects: LeaderboardProject[]) {
      if (this.ready) {
        throw new Error(
          'The project store is already initialized, cannot initialize again'
        )
      }

      this.projects = projects.reduce((records, project) => {
        records[project.id] = project
        return records
      }, {} as ProjectRecords)
      this.ready = true
    },
  },
})
