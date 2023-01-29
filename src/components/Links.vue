<template>
  <a
    v-if="isExternal"
    :class="{ 'external-link': !hideArrow }"
    :href="destination"
    :aria-label="ariaLabel"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
  <router-link v-else :to="to" :aria-label="ariaLabel">
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps(['to', 'ariaLabel', 'hideArrow', 'href'])

const destination = computed(() => props.href ?? props.to)

const protocols = ['http', 'mailto:']
const isExternal = computed(() => {
  return typeof props.to === 'string'
    ? protocols.some((protocol) => props.to.startsWith(protocol))
    : false
})
</script>

<style scoped lang="scss">
@import '../styles/vars';
@import '../styles/theme';

.external-link {
  &:after {
    margin-left: 0.125em;
    margin-right: 0.3em;
    display: inline;
    content: '↗';
    transition: all 0.1s ease-in-out;
    font-style: normal;
  }
  &:hover {
    &:after {
      transform: translate(0.1em, -0.1em);
    }
  }
}
</style>
