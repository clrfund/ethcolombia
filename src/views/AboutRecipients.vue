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
                depositToken: chain.currency,
                depositAmount: depositAmount,
              })
            }}
          </li>
        </ol>
      </li>
    </ol>

    <h3>Complete KYC</h3>
    <p>
      You'll submit a contact email address as part of your project's
      application. The email address will not be stored on-chain (with the rest
      of the application data) but it will be sent to the registry admin (the
      clr.fund team) and the Ethereum Foundation for the purposes of completing
      your KYC. The Ethereum Foundation will use this email address to contact
      you and verify information about your project. The registry admin may
      reject projects that don't meet the round criteria or pass KYC/AML
      requirements.
    </p>
    <p>
      {{ $t('recipients.register.p4') }}
    </p>
    <p>
      {{ $t('recipients.register.p5', { depositToken: chain.currency }) }}
    </p>
    <h4>Required documents</h4>
    <p style="text-decoration: underline">For individuals</p>
    <ol>
      <li>Scanned copy of passport</li>
      <li>
        Proof of address from within the last 3 months, such as bank statement,
        utility bill or telecom subscription
      </li>
    </ol>
    <p style="text-decoration: underline">For organizations</p>
    <ol>
      <li>Certificate of Incorporation</li>
      <li>
        Proof of address from within the last 3 months, such as bank statement,
        utility bill or telecom subscription
      </li>
      <li>
        Shareholders' and Directors' registers / Members' register (for
        organization without shareholdings)
      </li>
      <li>
        For each director, officer and individual shareholder (more than 10%),
        please provide (i) scan copy of passport, and (ii) copy of proof of
        address
      </li>
      <li>
        If the shareholder is an organization and holds more than 10%, please
        provide 1 through 4
      </li>
    </ol>

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

const { chain, maxRecipients, recipientDepositAmount } = storeToRefs(
  useRoundStore()
)

const depositAmount = computed(() => {
  if (recipientDepositAmount.value === null) {
    return null
  }

  return formatAmount(recipientDepositAmount.value)
})
</script>
