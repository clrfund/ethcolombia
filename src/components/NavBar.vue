<template>
  <nav id="nav-bar">
    <links to="/">
      <img class="clr-logo" :alt="operator" src="@/assets/clr.svg" />
    </links>
    <div class="btn-row">
      <div class="help-dropdown" v-click-outside="closeHelpDropdown">
        <img
          @click="toggleHelpDropdown()"
          class="navbar-btn"
          src="@/assets/help.svg"
        />
        <div id="myHelpDropdown" class="button-menu" v-if="showHelpDropdown">
          <div
            v-for="({ to, text, emoji }, idx) of dropdownItems"
            :key="idx"
            class="dropdown-item"
            @click="closeHelpDropdown"
          >
            <links :to="to">
              <div class="emoji-wrapper">{{ emoji }}</div>
              <p class="item-text">{{ $t(text) }}</p>
            </links>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Links from './Links.vue'
import { useRoundStore } from '@/stores'
import { storeToRefs } from 'pinia'

const showHelpDropdown = ref(false)

const dropdownItems = ref<{ to: string; text: string; emoji: string }[]>([
  { to: '/', text: 'dynamic.navBar.dropdown.home', emoji: '🏠' },
  {
    to: '/about',
    text: 'dynamic.navBar.dropdown.about',
    emoji: 'ℹ️',
  },
  {
    to: '/about/how-it-works',
    text: 'dynamic.navBar.dropdown.how',
    emoji: '⚙️',
  },
  {
    to: '/about/maci',
    text: 'dynamic.navBar.dropdown.maci',
    emoji: '🤑',
  },
  {
    to: '/about/sybil-resistance',
    text: 'dynamic.navBar.dropdown.sybil',
    emoji: '👤',
  },
  {
    to: 'https://github.com/clrfund/monorepo/',
    text: 'dynamic.navBar.dropdown.code',
    emoji: '👾',
  },
])

const { chain, operator } = storeToRefs(useRoundStore())
const isLayer2 = computed(() => chain.value.isLayer2)

watch(isLayer2, (newIsLayer2) => {
  if (newIsLayer2) {
    dropdownItems.value.splice(-1, 0, {
      to: '/about/layer-2',
      text: 'dynamic.navBar.dropdown.layer2',
      emoji: '🚀',
    })
  }
})

function closeHelpDropdown(): void {
  showHelpDropdown.value = false
}

function toggleHelpDropdown(): void {
  showHelpDropdown.value = !showHelpDropdown.value
}
</script>

<style scoped lang="scss">
@import '../styles/vars';
@import '../styles/theme';

#nav-bar {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  padding: 0 1.5rem;
  height: 64px;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary-color);
  box-shadow: $box-shadow-nav-bar;
  @media (max-width: $breakpoint-m) {
    padding: 0 1rem;
  }

  .btn-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .help-dropdown {
    position: relative;
    display: inline-block;
    margin-left: 0.5rem;

    .button-menu {
      padding: 0.5rem 0.5rem;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 2rem;
      right: 4px;
      background: var(--bg-secondary-color);
      border-radius: 0.5rem;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
      cursor: pointer;
      overflow: hidden;

      @media (max-width: $breakpoint-s) {
        right: 0.5rem;
      }

      .dropdown-title {
        padding: 0.5rem;
        font-weight: 600;
      }

      .dropdown-item a {
        display: flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        gap: 0.5rem;
        width: 176px;
        &:after {
          color: var(--text-color);
        }
        &:hover {
          background: var(--bg-light-color);
        }

        .item-text {
          margin: 0;
          color: var(--text-color);
        }
      }
    }
  }

  .button-menu links {
    font-size: 16px;
  }

  .clr-logo {
    margin: 0;
    height: 2.25rem;
    vertical-align: middle;
  }

  .margin-right {
    margin-right: 0.5rem;
  }
}
</style>
