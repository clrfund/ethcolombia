import { defineStore } from 'pinia'
import { type RoundInfo, RoundStatus } from '@/api/round'
import { type ChainDetails, CHAIN_INFO } from '@/plugins/Web3/constants/chains'
import { BigNumber, FixedNumber } from 'ethers'
import { DateTime } from 'luxon'
import type { Tally } from '@/api/tally'
import type { LeaderboardProject } from '@/api/projects'

interface RoundState extends RoundInfo {
  blogUrl?: string
  operator: string
  chainId: number
  recipientDepositAmount: BigNumber | null
  recipientDepositToken: string
  recipientDepositDecimals: BigNumber
  tally: Tally | null
  leaderboardProjects: LeaderboardProject[] | null
}

export const useRoundStore = defineStore('round', {
  state: (): RoundState => ({
    fundingRoundAddress: '',
    userRegistryAddress: '',
    recipientRegistryAddress: '',
    recipientDepositAmount: null,
    recipientDepositToken: '',
    recipientDepositDecimals: BigNumber.from(0),
    maciAddress: '',
    recipientTreeDepth: 0,
    maxContributors: 0,
    maxRecipients: 0,
    maxMessages: 0,
    coordinatorPubKey: null,
    nativeTokenAddress: '',
    nativeTokenSymbol: '',
    nativeTokenDecimals: 0,
    voiceCreditFactor: BigNumber.from(0),
    status: '',
    startTime: DateTime.now(),
    signUpDeadline: DateTime.now(),
    votingDeadline: DateTime.now(),
    totalFunds: BigNumber.from(0),
    matchingPool: BigNumber.from(0),
    contributions: BigNumber.from(0),
    contributors: 0,
    messages: 0,
    blogUrl: '',
    operator: 'Clr.fund',
    chainId: 1,
    tally: null,
    leaderboardProjects: null,
  }),
  getters: {
    chain(): ChainDetails {
      return CHAIN_INFO[this.chainId]
    },
    isRoundCancelled(): boolean {
      return Boolean(this.status === RoundStatus.Cancelled)
    },
    isRoundFinalized(): boolean {
      return Boolean(this.status === RoundStatus.Finalized)
    },
  },
})
