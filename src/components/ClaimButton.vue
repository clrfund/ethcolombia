<template>
  <div>
    <loader v-if="!ready" />
    <p v-else>
      {{
        $t('claimButton.p', {
          allocatedAmount,
          tokenSymbol: nativeTokenSymbol,
        })
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LeaderboardProject } from '@/api/projects'
import { formatAmount } from '@/utils/amounts'
import Loader from '@/components/Loader.vue'

import { useRoundStore, useAppStore } from '@/stores'
import { storeToRefs } from 'pinia'

interface Props {
  project: LeaderboardProject
}
const props = defineProps<Props>()

const { ready } = storeToRefs(useAppStore())
const { nativeTokenSymbol, nativeTokenDecimals } = storeToRefs(useRoundStore())

const allocatedAmount = computed(() => {
  const amount = props.project.allocatedAmount
  const maxDecimals = 6
  return amount
    ? formatAmount(amount, nativeTokenDecimals.value, null, maxDecimals)
    : '0'
})
</script>

<style scoped lang="scss">
@import '../styles/vars';
@import '../styles/theme';
</style>
