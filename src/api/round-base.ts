import type { BigNumber } from 'ethers'
import type { Token } from './token'
import type { RoundInfo } from './round'
import type { LeaderboardProject, Project } from './projects'
import type { Tally } from '@/api/tally'

type BaseRoundConstructorArgs = {
  address: string
  isFinalized: boolean
  blogUrl: string | null
}

export function sortByAllocatedAmountDesc(
  entry1: LeaderboardProject,
  entry2: LeaderboardProject
): number {
  const amount1 = entry1.allocatedAmount
  const amount2 = entry2.allocatedAmount

  const diff = amount2.sub(amount1)
  return diff.isZero() ? 0 : diff.gt(0) ? 1 : -1
}

export abstract class BaseRound {
  address: string
  isFinalized: boolean
  blogUrl: string | null

  constructor({ address, isFinalized, blogUrl }: BaseRoundConstructorArgs) {
    this.address = address
    this.isFinalized = isFinalized
    this.blogUrl = blogUrl
  }

  abstract getTokenInfo(): Token
  abstract getRoundInfo(cachedRound?: RoundInfo): RoundInfo | null
  abstract getLeaderboardProjects(): LeaderboardProject[] | null
  abstract getProject(projectId: string): Project | null
  abstract getProjects(): Project[]
  abstract getAllocatedAmountByProjectIndex(
    projectIndex: number
  ): BigNumber | null
  abstract getTally(): Tally | null
}
