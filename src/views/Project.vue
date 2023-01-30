<template>
  <div>
    <loader v-if="!ready"></loader>
    <div class="grid cart-closed" v-if="project">
      <img
        class="project-image banner"
        :src="project.bannerImageUrl"
        :alt="project.name"
      />
      <project-profile
        class="details"
        :project="project"
        :previewMode="false"
      />
      <div class="sticky-column">
        <div class="desktop">
          <claim-button :project="project" />
        </div>
        <link-box :project="project" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Loader from '@/components/Loader.vue'
import ProjectProfile from '@/components/ProjectProfile.vue'
import LinkBox from '@/components/LinkBox.vue'
import ClaimButton from '@/components/ClaimButton.vue'

import { useProjectStore } from '@/stores'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMeta } from 'vue-meta'

const store = useProjectStore()
const { ready } = storeToRefs(store)

const route = useRoute()
const projectId = computed(() =>
  typeof route.params.id === 'string' ? route.params.id : route.params.id[0]
)

const project = computed(() =>
  ready ? store.getProject(projectId.value) : null
)

useMeta({
  title: project.value?.name || '',
})
</script>

<style scoped lang="scss">
@import '../styles/vars';
@import '../styles/theme';

@mixin project-grid() {
  display: grid;
  grid-template-columns: 1fr clamp(320px, 24%, 440px);
  grid-template-rows: repeat(2, auto);
  grid-template-areas: 'banner banner' 'details actions';
  grid-column-gap: 2rem;
  grid-row-gap: 3rem;
}

@mixin project-grid-mobile() {
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, auto);
  grid-template-areas: 'banner' 'details' 'actions';
  padding-bottom: 6rem;
}

.grid.cart-open {
  @include project-grid();
  @media (max-width: $breakpoint-xl) {
    @include project-grid-mobile();
  }
}

.grid.cart-closed {
  @include project-grid();
  @media (max-width: $breakpoint-m) {
    @include project-grid-mobile();
  }
}

.banner {
  grid-area: banner;
}

.sticky-column {
  grid-area: actions;
  position: sticky;
  top: 6rem;
  display: flex;
  flex-direction: column;
  align-self: start;
  gap: 1rem;
  @media (max-width: $breakpoint-l) {
    margin-bottom: 3rem;
  }
}

.project-image {
  border-radius: 4px;
  display: block;
  height: 320px;
  object-fit: cover;
  text-align: center;
  width: 100%;
}

.content {
  display: flex;
  gap: 3rem;
  margin-top: 4rem;
}
</style>
