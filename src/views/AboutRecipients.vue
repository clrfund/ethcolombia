<template>
  <div class="about">
    <h1 class="content-heading">{{ $t('recipients.heading.h1') }}</h1>
    <p>
      {{ $t('recipients.heading.p') }}
    </p>
    <div v-if="chain.bridge">
      <h2>{{ $t('recipients.funds.h2', { chain: chain.label }) }}</h2>
      <p>
        {{
          $t('recipients.funds.p1', {
            chain: chain.label,
            currency: chain.currency,
          })
        }}
        <span v-if="chain.isLayer2">
          {{ $t('recipients.funds.p2_t1') }}
          <links
            :to="{
              name: 'about-layer-2',
              params: {
                section: 'bridge',
              },
            }"
          >
            {{ $t('recipients.funds.cta') }}
          </links>
          {{ $t('recipients.funds.p2_t2', { chain: chain.label }) }}
        </span>
        <span v-else>
          <links :to="chain.bridge"> {{ $t('recipients.funds.link1') }}</links>
        </span>
      </p>
      <p v-if="chain.isLayer2">
        {{ $t('recipients.funds.p3', { chain: chain.label }) }}
        <links
          :to="{
            name: 'about-layer-2',
          }"
        >
          {{ $t('recipients.funds.link2') }}
        </links>
      </p>
    </div>
    <h2>{{ $t('recipients.register.h2') }}</h2>
    <p>
      {{ $t('recipients.register.p1') }}
    </p>
    <p>
      {{ $t('recipients.register.p2_t1') }}
      <links to="/about/maci">{{ $t('recipients.register.p2_link') }}</links
      >{{ $t('recipients.register.p2_t2', { maxRecipients }) }}
    </p>
    <p>
      {{ $t('recipients.register.p3') }}
    </p>
    <h3>{{ $t('recipients.register.h3') }}</h3>
    <ol>
      <li>
        {{ $t('recipients.register.li1')
        }}{{ $t('recipients.register.li1_link') }}
      </li>
      <li>
        {{ $t('recipients.register.li2') }}
      </li>
      <li>
        {{ $t('recipients.register.li3') }}
      </li>
      <li>
        {{ $t('recipients.register.li4') }}
        <ol>
          <li>{{ $t('recipients.register.li5') }}</li>
          <li v-if="depositAmount">
            {{
              $t('recipients.register.li6', {
                depositToken: recipientDepositToken,
                depositAmount: depositAmount,
              })
            }}
          </li>
        </ol>
      </li>
    </ol>

    <p>
      {{ $t('recipients.register.p4') }}
    </p>
    <p>
      {{
        $t('recipients.register.p5', { depositToken: recipientDepositToken })
      }}
    </p>
    <h2>{{ $t('recipients.claim.h2') }}</h2>
    <p>
      {{ $t('recipients.claim.p') }}
    </p>
    <h2>{{ $t('recipients.how.h2') }}</h2>
    <p>
      {{ $t('recipients.how.p') }}
      <links to="/about/how-it-works">{{ $t('recipients.how.link') }}</links
      >.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Links from '@/components/Links.vue'
import { formatAmount } from '@/utils/amounts'
import { useRoundStore } from '@/stores'
import { storeToRefs } from 'pinia'

const {
  chain,
  maxRecipients,
  recipientDepositAmount,
  recipientDepositToken,
  recipientDepositDecimals,
} = storeToRefs(useRoundStore())

const depositAmount = computed(() => {
  if (recipientDepositAmount.value === null) {
    return null
  }

  return formatAmount(
    recipientDepositAmount.value,
    recipientDepositDecimals.value
  )
})
</script>
