<template>
  <div :class="`tab-container ${isOnRoundPage ? 'mobile-l' : 'mobile'}`">
    <links
      v-for="({ icon, title, to }, idx) of tabs"
      :key="idx"
      :class="{
        'tab-item': true,
        active: activeTab === to,
      }"
      :to="to"
    >
      <div class="icon">
        <img :src="getAssetsUrl(icon)" :alt="title" width="16px" />
      </div>
      <span class="tab-title">{{ $t(`dynamic.mobile.tab.${title}`) }}</span>
    </links>
  </div>
</template>

<script setup lang="ts">
import { getAssetsUrl } from '@/utils/url'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Links from '@/components/Links.vue'

const tabs = [
  {
    icon: 'timer.svg',
    title: 'Round',
    to: '/round-information',
  },
  {
    icon: 'projects.svg',
    title: 'Projects',
    to: '/projects',
  },
]

const route = useRoute()

const activeTab = computed(() => route.path)

const isOnRoundPage = computed(() => route.name === 'round-information')
</script>

<style lang="scss" scoped>
@import '../styles/vars';
@import '../styles/theme';

.tab-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 4rem;
  background: var(--bg-light-color);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
}

.tab-item {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding-top: 0.25rem;
}

.tab-title {
  margin: 0.25rem;
  line-height: 0;
  margin-top: -0.75rem;
  font-size: 14px;
  text-transform: uppercase;
  color: var(--text-color);
}

.icon {
  display: flex;
  gap: 0.25rem;
}

.active {
  background: var(--bg-secondary-color);
  box-shadow: inset 0px 2px 0px $border-light;
}
</style>
