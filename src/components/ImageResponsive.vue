<template>
  <img
    :src="src"
    :srcset="srcset"
    sizes="(max-width: 710px) 180px,
     (max-width: 810px) 360px, 
     (max-width: 1080px) 720px, 
     (max-width: 1440px) 1080px, 
     (max-width: 2160px) 2160px, 1440px"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getAssetsUrl } from '@/utils/url'

interface Props {
  title: string
}
const props = defineProps<Props>()

const BREAKPOINTS = [360, 720, 1080, 1440, 2160, 2880]

function requirePath(name: string, breakpoint: number): string {
  return getAssetsUrl(`${name}/${name}_w${breakpoint}.png`)
}

const srcset = computed(() => {
  return BREAKPOINTS.map((breakpoint) => {
    const path = requirePath(props.title, breakpoint)
    return `${path} ${breakpoint}w`
  }).join(', ')
})

const src = computed(() => {
  return requirePath(props.title, 1080)
})
</script>
