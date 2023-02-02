<template>
  <div class="projects">
    <div class="round-info">
      <div class="image-wrapper">
        <image-responsive title="docking" />
      </div>
      <template v-if="ready">
        <div class="round">
          <div class="round-title-bar">
            <h2 class="round-title">{{ operator }}</h2>
            <VDropdown class="verified-container" theme="contract-popover">
              <div class="verified">
                <img src="@/assets/verified.svg" />
              </div>
              <template #popper>
                <div class="contract-popover">
                  <div class="contract-address">
                    {{ fundingRoundAddress }}
                  </div>
                  <links :to="blockExplorer.url">{{
                    $t('roundInfo.link1', {
                      blockExplorer: blockExplorer.label,
                    })
                  }}</links>
                </div>
              </template>
            </VDropdown>
          </div>
          <div class="status" v-if="isRoundCancelled">
            <div class="circle closed" />
            {{ $t('roundInfo.div1') }}
          </div>
          <div v-else class="status">
            <div class="circle closed" />
            {{ $t('roundInfo.div3') }}
          </div>
        </div>
        <div
          :class="{ hidden: !(showNotice && haveNotice) }"
          class="round-notice"
        >
          <span class="bold-all-caps">
            <p>{{ $t('roundInfo.p1') }}</p>
          </span>
          <p>
            {{ $t('roundInfo.p2') }}
          </p>
          <p v-if="blogUrl">
            {{ $t('roundInfo.more') }}
            <links :to="blogUrl">{{ blogUrl }}</links>
          </p>

          <div class="dismiss-btn" @click="toggleNotice">
            {{ $t('roundInfo.div4') }}
          </div>
        </div>
        <div class="round-value-info">
          <div class="round-value-info-item">
            <div class="full-width">
              <div class="round-info-item-top">
                <div class="round-info-title">{{ $t('roundInfo.div15') }}</div>
                <div
                  v-tooltip="{
                    content: $t('roundInfo.tooltip7'),
                    trigger: 'hover click',
                  }"
                >
                  <img class="info-img" src="@/assets/info.svg" />
                </div>
              </div>
              <div class="round-info-value">
                <div class="value large">{{ formatTotalInRound }}</div>
                <div class="unit">{{ nativeTokenSymbol }}</div>
              </div>
            </div>
          </div>
          <div class="round-info-sub-item">
            <div class="round-info-item-top">
              <div class="round-info-title">{{ $t('roundInfo.div16') }}</div>
              <div
                v-tooltip="{
                  content: $t('roundInfo.tooltip8'),
                  trigger: 'hover click',
                }"
              >
                <img class="info-img" src="@/assets/info.svg" />
              </div>
            </div>

            <div class="round-info-value">
              <div class="value">
                {{ formatMatchingPool }}
              </div>
              <div class="unit">{{ nativeTokenSymbol }}</div>
            </div>
          </div>
          <div class="round-info-sub-item">
            <div>
              <div class="round-info-title">{{ $t('roundInfo.div17') }}</div>
              <div class="round-info-value">
                <div class="value">
                  {{ formatContributions }}
                </div>
                <div class="unit">{{ nativeTokenSymbol }}</div>
              </div>
            </div>
          </div>
          <div class="round-info-sub-item">
            <div>
              <div class="round-info-title">{{ $t('roundInfo.div18') }}</div>
              <div class="round-info-value">
                <div class="value">{{ contributors }}</div>
                <div class="unit">
                  {{ $t('roundInfo.div19')
                  }}{{ contributors > 1 ? $t('roundInfo.pluralism') : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <loader v-if="!ready" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatAmount as formatAmountUtil } from '@/utils/amounts'
import Loader from '@/components/Loader.vue'
import Links from '@/components/Links.vue'
import ImageResponsive from '@/components/ImageResponsive.vue'
import { useAppStore, useRoundStore } from '@/stores'
import { lsGet } from '@/utils/localStorage'
import type { BigNumber, FixedNumber } from 'ethers'
import { storeToRefs } from 'pinia'

const maxDecimals = 4

const { ready } = storeToRefs(useAppStore())
const {
  fundingRoundAddress,
  isRoundCancelled,
  isRoundFinalized,
  chain,
  operator,
  contributions,
  matchingPool,
  nativeTokenDecimals,
  blogUrl,
  contributors,
  nativeTokenSymbol,
} = storeToRefs(useRoundStore())

const lsIsNoticeHiddenKey = computed(
  () => `${fundingRoundAddress.value}.is-notice-hidden`
)

const showNotice = ref(!lsGet(lsIsNoticeHiddenKey.value, false))

const blockExplorer = computed(() => {
  if (!ready.value) {
    return { label: '', url: '' }
  }

  return {
    label: chain.value.explorerLabel,
    url: `${chain.value.explorer}/address/${fundingRoundAddress.value}`,
  }
})

const formatMatchingPool = computed(() => {
  return formatAmount(matchingPool.value)
})

const formatContributions = computed(() => {
  return formatAmount(contributions.value)
})

const formatTotalInRound = computed(() => {
  if (!ready.value) {
    return ''
  }

  const totalInRound = contributions.value.add(matchingPool.value)
  return formatAmount(totalInRound)
})

function formatAmount(value: BigNumber | FixedNumber | string): string {
  if (!ready) {
    return ''
  }

  return formatAmountUtil(value, nativeTokenDecimals.value, maxDecimals)
}

const haveNotice = computed(() => Boolean(blogUrl?.value))

function toggleNotice() {
  showNotice.value = !showNotice.value
}
</script>

<style scoped lang="scss">
@import '../styles/vars';
@import '../styles/theme';

.image-wrapper {
  border-radius: 8px;
  background: var(--bg-gradient);
  height: 160px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.image-wrapper img {
  mix-blend-mode: exclusion;
  transform: rotate(15deg);
}

.round {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.round-title-bar {
  display: flex;
  align-items: center;
}
.round-title {
  line-height: 120%;
  margin: 0;
}

.verified-container {
  align-self: center;
}

.verified {
  img {
    filter: var(--img-filter, invert(0.3));
  }
}

.contract-address {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  margin-bottom: 0.5rem;
}

.circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.closed {
  width: 12px;
  height: 12px;
  background: var(--bg-light-color);
}

.open-pulse {
  animation: pulse-animation 2s infinite ease-out;
  background: $clr-green;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px $idle-color;
  }

  50% {
    box-shadow: 0 0 0 2.5px $clr-green;
  }

  100% {
    box-shadow: 0 0 0 5px $clr-pink;
  }
}

.projects {
  display: flex;
  justify-content: center;
}

.round-info {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1rem;
  max-width: inherit;
  width: 100%;
  @media (max-width: $breakpoint-m) {
    padding: 1rem;
    padding-bottom: 4rem;
  }
}

.round-value-info {
  width: 100%;
  display: grid;
  align-items: center;
  margin-bottom: 3rem;
  border-radius: 0.5rem;

  img {
    opacity: 0.6;
  }

  & > div {
    box-shadow: inset 0px -1px 0px #7375a6;
    &:first-of-type {
      border-radius: 0.5rem 0.5rem 0 0;
    }
    &:last-of-type {
      border-radius: 0 0 0.5rem 0.5rem;
      box-shadow: none;
    }
  }
}

.round-value-info-item {
  display: flex;
  flex: 1 0 auto;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-light-highlight);
  padding: 1rem;
}

.round-info-item {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  justify-content: space-between;
  align-items: flex-start;
  background: var(--bg-light-highlight);
  padding: 1rem;
  border-radius: 0.5rem;
  box-sizing: border-box;
  width: 100%;

  img {
    opacity: 0.6;
  }
}

.round-info-item-top {
  width: 100%;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.round-info-sub-item {
  flex: 1 0 10%;
  background: var(--bg-secondary-highlight);
  padding: 1rem;

  img {
    opacity: 0.6;
  }
}

.round-info-title {
  color: var(--text-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 120%;
  text-transform: uppercase;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.round-info-value {
  display: flex;
  flex-direction: row;
  align-items: flex-end;

  .value {
    font-size: 24px;
    font-family: 'Glacial Indifference', sans-serif;
    color: var(--text-color);
    font-weight: 700;
    line-height: 120%;

    &.large {
      font-size: 32px;
      line-height: 120%;
    }

    &.extra {
      font-size: 32px;
      font-family: 'Glacial Indifference', sans-serif;
      color: var(--text-color);
      line-height: 120%;
    }
  }

  .unit {
    color: var(--text-color);
    font-family: 'Glacial Indifference', sans-serif;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 150%;
    margin: 0 0.5rem;

    &:last-child {
      margin-right: 0;
    }
  }
}

.round-announcement-info {
  .value {
    font-size: 24px;
    font-family: 'Glacial Indifference', sans-serif;
    color: white;
    font-weight: 700;
    line-height: 120%;

    &.large {
      font-size: 32px;
      line-height: 120%;
    }

    &.extra {
      font-size: 32px;
      font-family: 'Glacial Indifference', sans-serif;
      color: white;
      line-height: 120%;
    }
  }

  .unit {
    color: white;
    font-family: 'Glacial Indifference', sans-serif;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 150%;
    margin: 0 0.5rem;

    &:last-child {
      margin-right: 0;
    }
  }
}

.message {
  color: var(--text-color);
  font-family: 'Glacial Indifference', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 150%;
}

.add-matching-funds-btn {
  display: inline-block;
  margin-left: 5px;

  img {
    height: 1.8em;
    vertical-align: middle;
  }
}

.project-list {
  box-sizing: border-box;
  margin: 100%;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $content-space;
}

/* @media (max-width: 1500px) {
  .round-info-item:nth-child(2n) {
    break-after: always;
  }

  .round-info-title {
    margin-bottom: $content-space / 2;
    font-size: 14px;
  }
} */

.status {
  font-size: 16px;
  display: flex;
  align-items: center;
}

.full-width {
  width: 100%;
}

.round-notice {
  background: var(--warning-background);
  border: 1px solid var(--warning-border);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem 1rem;
  color: var(--warning-color);
  font-size: 14px;
  line-height: 150%;
  font-weight: 500;
  .bold-all-caps {
    text-transform: uppercase;
    font-weight: 600;
  }
  .dismiss-btn {
    @include button(var(--warning-color), none, 1px solid var(--warning-color));
    margin: 0 auto;
    width: fit-content;
    padding: 0.25rem 1.25rem;
  }
}

.hidden {
  display: none;
}

.has-tooltip {
  filter: var(--img-filter, invert(0.7));
}

.tooltip-content {
  width: 300px;
}

.contract-popover {
  background-color: var(--bg-primary-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  padding: 1rem;
  border: solid 1px var(--border-highlight);
  border-radius: 6px;
  box-shadow: 0 6px 30px #0000001a;
}

.info-img {
  width: 16px;
}
</style>
