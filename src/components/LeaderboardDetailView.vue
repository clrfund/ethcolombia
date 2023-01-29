<template>
  <div>
    <div class="info">
      <div class="icon" aria-label="info icon">ℹ</div>
      <div class="message">
        {{ $t('leaderboard.message') }}
      </div>
    </div>

    <div class="content">
      <div class="card desktop">
        <div class="rank">#</div>
        <div class="project">{{ $t('leaderboard.heading.project') }}</div>
        <div class="votes">{{ $t('leaderboard.heading.votes') }}</div>
        <div class="donation heading">
          <div>{{ $t('leaderboard.heading.donation') }}</div>
          <div class="desktop symbol">
            <img :src="tokenLogo" :alt="tokenSymbol" />
          </div>
        </div>
        <div class="funding heading">
          <div>{{ $t('leaderboard.heading.total') }}</div>
          <div class="desktop symbol">
            <img :src="tokenLogo" :alt="tokenSymbol" />
          </div>
        </div>
      </div>
      <div v-for="(project, index) in projects" :key="project.id">
        <links :to="projectRoute(project.id)">
          <div
            class="card"
            :class="{
              first: index === 0,
              second: index === 1,
              third: index === 2,
            }"
          >
            <div class="rank">
              {{ index + 1 }}
            </div>
            <div class="project">
              {{ project.name }}
            </div>
            <div class="votes">
              <span class="mobile"
                >{{ $t('leaderboard.heading.votes') }}:
              </span>
              <span>{{ formatVotes(project.votes) }}</span>
            </div>
            <div class="donation">
              <span class="mobile"
                >{{ $t('leaderboard.heading.donation') }}:
              </span>
              <span>~{{ formatDonation(project.donation) }}</span>
              <div class="mobile symbol">
                <img :src="tokenLogo" :alt="tokenSymbol" />
              </div>
            </div>
            <div class="funding">
              <span class="mobile"
                >{{ $t('leaderboard.heading.total') }}:
              </span>
              <span class="amount">
                ~{{ formatAmount(project.allocatedAmount) }}
              </span>
              <div class="mobile symbol">
                <img :src="tokenLogo" :alt="tokenSymbol" />
              </div>
            </div>
          </div>
        </links>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Links from '@/components/Links.vue'
import type { LeaderboardProject } from '@/api/projects'
import type { LeaderboardRoundInfo } from '@/api/round'
import type { BigNumber } from 'ethers'
import { formatAmount as formatAmountUtil } from '@/utils/amounts'
import { getTokenLogo } from '@/api/token'
import { projectRoute } from '@/api/projects'
import { getAssetsUrl } from '@/utils/url'

interface Props {
  projects: LeaderboardProject[]
  round: LeaderboardRoundInfo
}
const props = defineProps<Props>()

function formatVotes(votes: BigNumber): string {
  // pass votes as string to skip formatting by tokenDecimal
  return formatAmountUtil(votes.toString(), 0, null, 0)
}

function formatAmount(amount?: BigNumber): string {
  const sanitizedAmount = amount ?? '0'
  return formatAmountUtil(
    sanitizedAmount,
    props.round.nativeTokenDecimals,
    null,
    0
  )
}

function formatDonation(amount: BigNumber): string {
  const { voiceCreditFactor } = props.round
  const scaledAmount = amount.mul(voiceCreditFactor)
  return formatAmount(scaledAmount)
}

const tokenLogo = computed(() => {
  const logo = getTokenLogo(props.round.nativeTokenSymbol)
  return getAssetsUrl(logo)
})
const tokenSymbol = computed(() => props.round.nativeTokenSymbol)
</script>

<style scoped lang="scss">
@import '../styles/vars';
@import '../styles/theme';

.content {
  font-weight: normal;
  font-weight: 300;
  line-height: 140%;
}

.first {
  color: $rank-1-color;
}
.second {
  color: $rank-2-color;
}
.third {
  color: $rank-3-color;
}

.info {
  background-color: var(--bg-transparent);
  border: 1px solid $highlight-color;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 16px;
  font-family: Inter;
  line-height: 150%;
  font-weight: 500;
  display: flex;
  align-items: center;
  font-weight: 300;
  margin-bottom: 2rem;
  gap: 0.5rem;

  @media (max-width: $breakpoint-m) {
    flex-direction: column;
    padding-bottom: 1rem;
    align-items: flex-start;
  }

  .message {
    flex: 1 1 auto;
    text-align: justify;
  }

  .icon {
    font-size: 24px;
    padding: 0.5rem;
    flex: 0 0 auto;
    @media (max-width: $breakpoint-m) {
      padding: 0.5rem 0rem;
    }
  }
}

a {
  .card:hover {
    background: var(--bg-secondary-highlight);
  }
  color: var(--text-body);
}

.card {
  display: grid;
  gap: 1rem;
  text-align: start;
  align-content: start;
  grid-template-columns: auto 3fr 1fr 1fr 1fr;
  grid-template-areas: 'rank project votes donation funding';
  padding: 1rem;

  &.desktop {
    background: var(--bg-light-highlight);
  }

  @media (max-width: $breakpoint-m) {
    grid-template-columns: 1fr;
    gap: 1rem;
    grid-template-areas:
      'rank'
      'project'
      'funding'
      'donation'
      'votes';

    border: 1px solid $highlight-color;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .rank {
    grid-area: rank;
    font-size: 1rem;

    @media (max-width: $breakpoint-m) {
      font-size: 1.5rem;
    }
  }

  .project {
    grid-area: project;
  }

  .funding {
    grid-area: funding;
    text-align: right;
    flex: 1 1 auto;
    @media (max-width: $breakpoint-m) {
      .amount {
        font-size: 1.6rem;
      }
    }
  }

  .donation {
    grid-area: donation;
    text-align: right;
    .mobile {
      img {
        margin-left: 8px;
      }
    }
  }

  .votes {
    grid-area: votes;
    text-align: right;

    @media (max-width: $breakpoint-m) {
      margin-right: 23px;
    }
  }
}

.heading {
  display: flex;
  justify-content: end;
  align-content: end;
  gap: 5px;
}

.symbol {
  display: inline;
  img {
    width: 14px;
  }
}
</style>
