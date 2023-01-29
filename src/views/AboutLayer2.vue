<template>
  <div class="about">
    <h1 class="content-heading">{{ $t('layer2.heading.title') }}</h1>

    <h2>{{ $t('layer2.heading.subtitle') }}</h2>
    <p>
      <b>
        {{ $t('layer2.heading.paragraph-1-text-1') }}
        <links
          to="https://ethereum.org/en/developers/docs/scaling/layer-2-rollups/"
        >
          {{ $t('layer2.heading.link-1') }}</links
        >
        {{ $t('layer2.heading.paragraph-1-text-2', { chain: chain.label }) }}
      </b>
    </p>
    <button
      v-if="chain.bridge"
      class="btn-secondary"
      @click="scrollToId('bridge')"
    >
      {{ $t('layer2.heading.cta') }}
    </button>

    <h2>{{ $t('layer2.transactions.title') }}</h2>
    <p>
      {{ $t('layer2.transactions.paragraph-1') }}
    </p>
    <p>
      {{ $t('layer2.transactions.paragraph-2') }}
    </p>

    <h2>{{ $t('layer2.scalability.title') }}</h2>
    <p>
      {{ $t('layer2.scalability.p1') }}
    </p>
    <p>
      {{ $t('layer2.scalability.p2') }}
    </p>
    <p>
      {{ $t('layer2.scalability.p3') }}
    </p>
    <p>
      {{ $t('layer2.scalability.p4_t1') }}
      <links
        to="https://ethereum.org/en/developers/docs/scaling/layer-2-rollups/"
      >
        {{ $t('layer2.scalability.p4_l1') }}</links
      >
    </p>
    <div v-if="chain.bridge" class="divider" id="bridge" />
    <!-- If chain is Arbitrum, display bridge information: -->
    <div v-if="chain.label.includes('Arbitrum')" class="chain-details">
      <h2>{{ chain.label }}</h2>
      <p>
        {{
          $t('layer2.arbitrum.p1', {
            operator,
            chain: chain.label,
          })
        }}
        <links to="https://developer.offchainlabs.com/docs/rollup_basics">{{
          $t('layer2.arbitrum.link', { chain: chain.label })
        }}</links>
      </p>

      <h2>{{ $t('layer2.arbitrum.subtitle') }}</h2>
      <ul>
        <li>{{ $t('layer2.arbitrum.li1', { chain: chain.label }) }}</li>
        <li>{{ $t('layer2.arbitrum.li2', { chain: chain.label }) }}</li>
      </ul>
      <h3>
        {{ $t('layer2.arbitrum.h3', { chain: chain.label }) }}
        <img
          v-tooltip="{
            content: $t('layer2.arbitrum.tooltip'),
            trigger: 'hover click',
          }"
          width="16px"
          src="@/assets/info.svg"
        />
      </h3>
      <ul>
        <li>
          {{ $t('layer2.arbitrum.li3_t1') }}
          <links to="https://portal.arbitrum.one/">
            {{ $t('layer2.arbitrum.li3_link', { chain: chain.label }) }}
          </links>
          {{ $t('layer2.arbitrum.li3_t2', { chain: chain.label }) }}
        </li>
        <li>
          {{ $t('layer2.arbitrum.li4_t1') }}
          <links to="https://walletconnect.com/">
            {{ $t('layer2.arbitrum.li4_link') }}
          </links>
          {{ $t('layer2.arbitrum.li4_t2') }}
        </li>
      </ul>
      <h3>{{ $t('layer2.arbitrum.funds.h3', { chain: chain.label }) }}</h3>
      <p>
        <links :to="chain.bridge" :hideArrow="true">
          <button class="btn-action">
            {{ $t('layer2.arbitrum.funds.button', { chain: chain.label }) }}
          </button>
        </links>
      </p>
      <p>
        {{ $t('layer2.arbitrum.funds.p1_t1') }}
        <links to="https://arbitrum.io/bridge-tutorial/">
          {{ $t('layer2.arbitrum.funds.link1') }}
        </links>
        {{ $t('layer2.arbitrum.funds.p1_t2') }}
      </p>
      <ol>
        <li>{{ $t('layer2.arbitrum.funds.li1', { chain: chain.label }) }}</li>
        <li>
          {{ $t('layer2.arbitrum.funds.li2', { chain: chain.label }) }}
          <strong> {{ $t('layer2.arbitrum.funds.li2_b') }}</strong>
        </li>
        <li>
          {{
            $t('layer2.arbitrum.funds.li3', {
              nativeTokenSymbol: nativeTokenSymbol,
            })
          }}
          <p>
            {{
              $t('layer2.arbitrum.funds.li3_p', {
                nativeTokenSymbol: nativeTokenSymbol,
              })
            }}
          </p>
        </li>
        <li>{{ $t('layer2.arbitrum.funds.li4') }}</li>
        <li>{{ $t('layer2.arbitrum.funds.li5') }}</li>
      </ol>
      <p>
        {{
          $t('layer2.arbitrum.funds.p2_t1', {
            nativeTokenSymbol,
            chain: chain.label,
          })
        }}
        <links :to="blockExplorerUrl">{{
          $t('layer2.arbitrum.funds.p2_link')
        }}</links>
        {{ $t('layer2.arbitrum.funds.p2_t2') }}
      </p>
    </div>
    <!-- If chain isn't Arbitrum, but still has a bridge URL, display its information: -->
    <div v-else-if="chain.bridge">
      <h2>{{ chain.label }}</h2>
      <h2>{{ $t('layer2.not_arbitrum.subtitle') }}</h2>
      <ul>
        <li>{{ $t('layer2.not_arbitrum.li1', { chain: chain.label }) }}</li>
        <li>{{ $t('layer2.not_arbitrum.li2', { chain: chain.label }) }}</li>
      </ul>
      <h2>{{ $t('layer2.not_arbitrum.h2', { chain: chain.label }) }}</h2>
      <p>
        <links :to="chain.bridge" :hideArrow="true">
          <button class="btn-action">
            {{ $t('layer2.not_arbitrum.cta', { chain: chain.label }) }}
          </button>
        </links>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Links from '@/components/Links.vue'
import { useAppStore, useRoundStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()
const { ready } = storeToRefs(useAppStore())
const { chain, operator, nativeTokenAddress, nativeTokenSymbol } = storeToRefs(
  useRoundStore()
)

const blockExplorerUrl = computed(() =>
  ready.value
    ? `${chain.value.explorer}/address/${nativeTokenAddress.value}`
    : ''
)

onMounted(() => {
  const { section: id } = route.params
  if (id) {
    scrollToId(id as string)
  }
})

function scrollToId(id: string): void {
  const element = document.getElementById(id)
  if (!element) return
  const navBarOffset = 80
  const elementPosition = element.getBoundingClientRect().top
  const top = elementPosition - navBarOffset
  window.scrollTo({ top, behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
@import '../styles/vars';
@import '../styles/theme';

button {
  margin: 2rem 0;

  @media (max-width: $breakpoint-s) {
    width: 100%;
  }
}
</style>
