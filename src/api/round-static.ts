import type { RoundInfo } from './round'
import { RoundStatus } from './round'
import { BaseRound, sortByAllocatedAmountDesc } from './round-base'
import type { Tally } from '@/api/tally'
import type { Project, LeaderboardProject } from './projects'
import type { Token } from './token'
import { BigNumber } from 'ethers'
import { DateTime } from 'luxon'
import { IPFS } from './ipfs'
import rounds from '@/rounds/rounds.json'

type RoundIndex = {
  address: string
  network: string
  startTime: number
}

interface StaticProject extends Project {
  allocatedAmount: string
  state: string
  recipientIndex: number
  metadata?: any
  recipientAddress: string
}

export type StaticRoundData = {
  chainId: number
  round: any
  tally: Tally | null
  projects: StaticProject[]
}

function toRoundStatus(round: any): RoundStatus {
  // For static rounds, we only have information about finalized or cancelled
  // So, if it's not finalized or cancelled, default to tallying
  return round.isCancelled
    ? RoundStatus.Cancelled
    : round.isFinalized
    ? RoundStatus.Finalized
    : RoundStatus.Tallying
}

function toRoundInfo(round: any, tally: Tally | null): RoundInfo {
  const nativeTokenDecimals = round.nativeTokenDecimals
  const voiceCreditFactor = BigNumber.from(round.voiceCreditFactor)
  const matchingPool = BigNumber.from(round.matchingPoolSize || 0)

  const spent = tally?.totalVoiceCredits?.spent || 0
  const contributions = BigNumber.from(spent).mul(voiceCreditFactor)
  const totalFunds = matchingPool.add(contributions)

  let recipientDepositAmount: BigNumber | null = null
  if (round.recipientDepositAmount) {
    recipientDepositAmount = BigNumber.from(round.recipientDepositAmount)
  }

  return {
    fundingRoundAddress: round.address,
    userRegistryAddress: round.userRegistryAddress,
    recipientRegistryAddress: round.recipientRegistryAddress,
    recipientDepositAmount,
    maciAddress: round.maciAddress,
    recipientTreeDepth: 0,
    maxContributors: 0,
    maxRecipients: round.maxRecipients || 0,
    maxMessages: round.maxMessages || 0,
    coordinatorPubKey: '',
    nativeTokenAddress: round.nativeTokenAddress,
    nativeTokenSymbol: round.nativeTokenSymbol,
    nativeTokenDecimals,
    voiceCreditFactor,
    status: toRoundStatus(round),
    startTime: DateTime.fromSeconds(round.startTime),
    contributors: round.contributorCount,
    signUpDeadline: DateTime.fromSeconds(
      Number(round.startTime || 0) + Number(round.signUpDuration || 0)
    ),
    votingDeadline: DateTime.fromSeconds(
      Number(round.startTime || 0) +
        Number(round.signUpDuration || 0) +
        Number(round.votingDuration || 0)
    ),
    totalFunds,
    matchingPool,
    contributions,
    messages: round.messages || 0,
  }
}

function mapTwitterUrl(metadata: any = {}): string {
  let twitter = metadata.twitter || metadata.twitterUrl || ''

  if (!twitter) {
    return ''
  }

  const twitterBaseUrl = 'https://twitter.com/'

  if (twitter.startsWith(twitterBaseUrl)) {
    return twitter
  }

  twitter = twitter.replace(/^@/, '')
  return new URL(`${twitterBaseUrl}${twitter}`).href
}

function toProjectInterface(project: StaticProject): Project {
  const imageUrl = IPFS.formatUrl(project.metadata?.imageHash)
  const twitterUrl = mapTwitterUrl(project.metadata)
  const bannerImageUrl = IPFS.formatUrl(project.metadata?.bannerImageHash)
  const thumbnailImageUrl = IPFS.formatUrl(project.metadata?.thumbnailImageHash)

  return {
    id: project.id,
    address: project.recipientAddress,
    requester: project.requester,
    name: project.name,
    tagline: project.metadata?.tagline,
    description: project.metadata?.description || '',
    category: project.metadata?.category,
    problemSpace: project.metadata?.problemSpace,
    plans: project.metadata?.plans,
    teamName: project.metadata?.teamName,
    teamDescription: project.metadata?.teamDescription,
    githubUrl: project.metadata?.githubUrl,
    radicleUrl: project.metadata?.radicleUrl,
    websiteUrl: project.metadata?.websiteUrl,
    twitterUrl,
    discordUrl: project.metadata?.discordUrl,
    bannerImageUrl:
      project.metadata?.bannerImageUrl || bannerImageUrl || imageUrl,
    thumbnailImageUrl: thumbnailImageUrl,
    imageUrl,
    index: project.recipientIndex,
    isHidden: project.state !== 'Accepted',
    isLocked: false,
  }
}

interface ProjectRecords {
  [key: string]: Project
}

interface AllocationRecords {
  [key: number]: BigNumber
}

/**
 * StaticRound loads round information from static json file
 * The path of the json file is defined in env. variable VUE_APP_STATIC_ROUNDS_BASE_URL
 */
export class StaticRound extends BaseRound {
  private round: RoundInfo
  private projects: Record<string, Project>
  private allocations: Record<number, BigNumber>
  private tally: Tally | null
  chainId: number
  operator: string

  constructor(data: StaticRoundData, isFinalized: boolean) {
    const blogUrl = data.round?.blogUrl ?? null
    super({ address: data.round?.address, isFinalized, blogUrl })

    this.operator = data.round.operator || 'Clr.fund'
    this.chainId = data.round.chainId ?? 1
    this.tally = data.tally ?? null
    this.round = toRoundInfo(data.round, data.tally)
    this.projects = data.projects
      .filter((project) => project.state === 'Accepted')
      .reduce((projects: ProjectRecords, project) => {
        projects[project.id] = toProjectInterface(project)
        return projects
      }, {})

    this.allocations = data.projects.reduce(
      (allocations: AllocationRecords, project) => {
        allocations[project.recipientIndex] = BigNumber.from(
          project.allocatedAmount || '0'
        )

        return allocations
      },
      {}
    )
  }

  getTokenInfo(): Token {
    const {
      nativeTokenAddress: address,
      nativeTokenSymbol: symbol,
      nativeTokenDecimals: decimals,
    } = this.round

    return {
      address,
      symbol,
      decimals,
    }
  }

  getRoundInfo(): RoundInfo | null {
    return this.round
  }

  /**
   * retrieve project information for the leaderboard view
   */
  getLeaderboardProjects(): LeaderboardProject[] | null {
    if (this.tally === null) {
      return null
    }

    const projects = Object.values(this.projects).map((project) => ({
      ...project,
      allocatedAmount: this.allocations[project.index] ?? BigNumber.from(0),
      donation: BigNumber.from(
        this.tally?.totalVoiceCreditsPerVoteOption.tally[project.index] ?? 0
      ),
      votes: BigNumber.from(this.tally?.results.tally[project.index] ?? 0),
    }))

    return projects.sort(sortByAllocatedAmountDesc)
  }

  /**
   * Return project information for the project profile view
   * @param projectId project id
   * @returns project information
   */
  getProject(projectId: string): Project | null {
    return this.projects[projectId] ?? null
  }

  /**
   * Get all the projects for this round
   */
  getProjects(): Project[] {
    return Object.values(this.projects)
  }

  /**
   * Return the amount allocated to the project
   * @param projectIndex project index used to access the tally result array
   * @returns the amount allocated to a project according to the tally result
   *          NULL if the project is not found or the round is not finalized
   */
  getAllocatedAmountByProjectIndex(projectIndex: number): BigNumber | null {
    return this.allocations[projectIndex] ?? null
  }

  /**
   * Return the tally result which is only available after a round is finalized
   * @returns tally result or null if a round is not finalized
   */
  getTally(): Tally | null {
    return this.tally
  }

  /**
   * load the latest static round data
   */
  static async load(): Promise<StaticRound> {
    const sortedRounds = rounds.sort((r1, r2) => r2.startTime - r1.startTime)
    const round = sortedRounds[0] as RoundIndex
    const { network, address } = round
    const data = await import(`../rounds/${network}/${address}.json`)
    const isFinalized = !!data.round.isFinalized && !data.round.isCancelled
    return new StaticRound(data, isFinalized)
  }
}
