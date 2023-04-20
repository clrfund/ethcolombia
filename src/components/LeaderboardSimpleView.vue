<template>
  <tr>
    <td class="image-container rank-col">
      <img v-if="isFirst" src="@/assets/medal/medal-1.svg" />
      <img v-else-if="isSecond" src="@/assets/medal/medal-2.svg" />
      <img v-else-if="isThird" src="@/assets/medal/medal-3.svg" />
      <div class="rank" v-else>{{ rank }}</div>
    </td>
    <td class="project">
      <links :to="projectRoute(project.id)">
        <div class="name-wrapper">
          <div class="desktop image-container">
            <img :src="projectImageUrl" />
          </div>
          <div class="project-name">{{ project.name }}</div>
        </div>
      </links>
    </td>
    <td class="funding">
      <div class="amount">~{{ formatAmount(project.allocatedAmount) }}</div>
      <div class="symbol">
        {{ $t('leaderboardSimpleView.funded', { tokenSymbol }) }}
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Links from '@/components/Links.vue'
import type { LeaderboardProject } from '@/api/projects'
import type { LeaderboardRoundInfo } from '@/api/round'
import type { BigNumber } from 'ethers'
import { formatAmount as formatAmountUtil } from '@/utils/amounts'
import { projectRoute } from '@/api/projects'

interface Props {
  project: LeaderboardProject
  round: LeaderboardRoundInfo
  rank: number
}
const props = defineProps<Props>()

const tokenSymbol = computed(() => props.round.nativeTokenSymbol || '')
const isFirst = computed(() => props.rank === 1)
const isSecond = computed(() => props.rank === 2)
const isThird = computed(() => props.rank === 3)

function formatAmount(amount?: BigNumber): string {
  const tokenDecimals = props.round.nativeTokenDecimals
  return amount ? formatAmountUtil(amount, tokenDecimals, null, 0) : '0'
}

const projectImageUrl = computed(() => {
  if (props.project.bannerImageUrl !== undefined) {
    return props.project.bannerImageUrl
  }
  if (props.project.imageUrl !== undefined) {
    return props.project.imageUrl
  }
  return ''
})
</script>

<style scoped lang="scss">
@import '../styles/vars';
@import '../styles/theme';

td {
  padding: 8px 3px;
  vertical-align: top;
}

td.rank-col {
  padding-left: 0;
}

td.project {
  :hover {
    background-color: var(--bg-light-highlight);
  }
}

.rank {
  color: var(--text-secondary);
  text-align: center;
}

.image-container {
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  overflow: hidden;
  align-items: center;
  box-shadow: 0px 4px 4px 0px 0, 0, 0, 0.25;
  flex: 0 0 auto;
  
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.project-name {
  color: var(--text-body);
}

.name-wrapper {
  display: flex;
  column-gap: 10px;
}

.funding {
  text-align: right;

  .amount {
    white-space: nowrap;
    font-size: 1.2rem;
  }

  .symbol {
    font-size: 0.6rem;
    white-space: nowrap;
  }
}
</style>
