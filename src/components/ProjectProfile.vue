<template>
  <div v-if="project" class="project-page">
    <info
      v-if="previewMode"
      class="info"
      :message="$t('projectProfile.info1')"
    />
    <img
      v-if="previewMode"
      class="project-image"
      :src="project.bannerImageUrl"
      :alt="project.name"
    />
    <div class="about">
      <h1
        class="project-name"
        :title="addressName"
        :project-index="project.index"
      >
        <links v-if="klerosCurateUrl" :to="klerosCurateUrl">{{
          project.name
        }}</links>
        <span v-else> {{ project.name }} </span>
      </h1>
      <p class="tagline">{{ project.tagline }}</p>
      <div class="subtitle">
        <div v-if="project.category" class="tag">
          {{ $t(categoryLocaleKey(project.category)) }}
          {{ $t('projectProfile.div1') }}
        </div>
        <div class="team-byline" v-if="!!project.teamName">
          {{ $t('projectProfile.div2') }}
          <links to="#team"> {{ project.teamName }}</links>
        </div>
      </div>
      <div class="mobile mb2">
        <claim-button :project="project" />
      </div>
      <div class="project-section">
        <h2>{{ $t('projectProfile.h2_1') }}</h2>
        <markdown :raw="project.description" />
      </div>
      <div v-if="project.problemSpace" class="project-section">
        <h2>{{ $t('projectProfile.h2_2') }}</h2>
        <markdown :raw="project.problemSpace" />
      </div>
      <div v-if="project.plans" class="project-section">
        <h2>{{ $t('projectProfile.h2_3') }}</h2>
        <markdown :raw="project.plans" />
      </div>
      <div
        :class="{
          'address-box': project.teamName || project.teamDescription,
          'address-box-no-team': !project.teamName && !project.teamDescription,
        }"
      >
        <div>
          <div class="address-label">{{ $t('projectProfile.div3') }}</div>
          <div class="address">
            {{ addressName }}
          </div>
        </div>
        <div class="copy-div" v-if="project.address">
          <copy-button
            :value="project.address"
            :text="$t('projectProfile.button1')"
            myClass="project-profile"
            :hasBorder="true"
          />
          <links
            v-if="ready"
            class="explorerLink"
            :to="blockExplorer.url"
            :title="
              $t('projectProfile.link1', { blockExplorer: blockExplorer.label })
            "
            :hideArrow="true"
          >
            <img class="icon" :src="getAssetsUrl(blockExplorer.logo)" />
          </links>
        </div>
      </div>
      <hr v-if="project.teamName || project.teamDescription" />
      <div
        id="team"
        v-if="project.teamName || project.teamDescription"
        class="team"
      >
        <h2>{{ $t('projectProfile.h2_4') }} {{ project.teamName }}</h2>
        <markdown
          v-if="project.teamDescription"
          :raw="project.teamDescription"
        />
      </div>
    </div>
    <link-box v-if="previewMode" :project="project" class="mt2" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import type { LeaderboardProject } from '@/api/projects'
import { ensLookup } from '@/utils/accounts'
import Info from '@/components/Info.vue'
import Markdown from '@/components/Markdown.vue'
import CopyButton from '@/components/CopyButton.vue'
import LinkBox from '@/components/LinkBox.vue'
import Links from '@/components/Links.vue'
import ClaimButton from '@/components/ClaimButton.vue'
import { useAppStore, useRoundStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { getAssetsUrl } from '@/utils/url'

interface Props {
  project: LeaderboardProject
  klerosCurateUrl?: string
  previewMode: boolean
}
const props = defineProps<Props>()

const ens = ref<string | null>(null)
const { ready } = storeToRefs(useAppStore())
const { chain } = storeToRefs(useRoundStore())

const addressName = computed(() => ens.value || props.project.address)

const blockExplorer = computed(() => {
  return {
    label: chain.value.explorerLabel,
    url: `${chain.value.explorer}/address/${props.project.address}`,
    logo: chain.value.explorerLogo,
  }
})

const projectAddress = computed(() => props.project.address)
watch(projectAddress, async (newAddress) => {
  if (newAddress) {
    ens.value = await ensLookup(newAddress)
  }
})

function categoryLocaleKey(category: string): string {
  return `dynamic.category.${category.toLowerCase()}`
}
</script>

<style lang="scss" scoped>
@import '../styles/vars';
@import '../styles/theme';

.project-page {
  h2 {
    font-size: 20px;
  }

  hr {
    border: 0;
    border-bottom: 0.5px solid $button-disabled-text-color;
    margin-bottom: 3rem;
  }

  .info {
    margin-bottom: 1.5rem;
  }

  .project-image {
    border-radius: 0.25rem;
    display: block;
    height: 20rem;
    object-fit: cover;
    text-align: center;
    width: 100%;
    margin-bottom: 2rem;
  }

  .content {
    display: flex;
    gap: 3rem;
    margin-top: 4rem;
  }

  .about {
    .project-name {
      font-family: 'Glacial Indifference', sans-serif;
      font-weight: bold;
      font-size: 2.5rem;
      letter-spacing: -0.015em;
      margin: 0;

      a {
        color: var(--text-color);
      }
    }

    .tagline {
      font-size: 1.5rem;
      line-height: 150%;
      margin-top: 0.25rem;
      margin-bottom: 1rem;
      font-family: 'Glacial Indifference', sans-serif;
    }

    .subtitle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 3rem;
      @media (max-width: $breakpoint-l) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .team-byline {
        line-height: 150%;
      }
    }

    .project-section {
      margin-bottom: 3rem;
      color: var(--text-body);
    }

    .address-box {
      padding: 1rem;
      margin-bottom: 3rem;
      border-radius: 0.5rem;
      box-shadow: var(--box-shadow);
      background: var(--bg-address-box);
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media (max-width: $breakpoint-m) {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }

      .address-label {
        font-size: 14px;
        margin: 0;
        font-weight: 400;
        margin-bottom: 0.25rem;
        text-transform: uppercase;
      }

      .address {
        display: flex;
        font-family: 'Glacial Indifference', sans-serif;
        font-weight: 600;
        border-radius: 8px;
        align-items: center;
        gap: 0.5rem;
        word-break: break-all;
      }
    }

    .address-box-no-team {
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: var(--box-shadow);
      background: var(--bg-address-box);
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media (max-width: $breakpoint-l) {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
    }

    .team {
      padding: 1rem;
      margin-bottom: 3rem;
      border-radius: 0.25rem;
      background: var(--bg-secondary-color);
      @media (max-width: $breakpoint-l) {
        margin-bottom: 0;
      }

      h2 {
        font-size: 24px;
        font-weight: 400;
        font-family: 'Glacial Indifference', sans-serif;
        margin-top: 0;
      }
    }
  }

  .sticky-column {
    position: sticky;
    top: 2rem;
    align-self: start;
    gap: 1rem;
    display: flex;
    flex-direction: column;

    .button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      justify-content: center;
    }
  }

  .copy-div {
    display: flex;
    gap: 0.5rem;

    .explorerLink {
      margin: 0;
      padding: 0;
      .icon {
        @include icon(none, var(--explorer-hover));
        border: 1px solid var(--explorer-border);
        filter: var(--img-filter, invert(0.7));
      }
    }
  }
}
</style>
