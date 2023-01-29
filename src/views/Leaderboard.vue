<template>
  <div>
    <loader v-if="!ready"></loader>
    <div v-else>
      <div v-if="leaderboardProjects">
        <div class="info" v-if="leaderboardProjects.length === 0">
          😢 {{ $t('leaderboard.no_project') }}
        </div>
        <template v-else>
          <div class="header">
            <div>
              <h2>{{ $t('leaderboard.header') }}</h2>
            </div>
            <button class="btn-secondary" @click="toggleView()">
              <div v-if="isSimpleView">{{ $t('leaderboard.more') }}</div>
              <div v-else>{{ $t('leaderboard.less') }}</div>
            </button>
          </div>
          <div class="hr" />
          <div>
            <div v-if="isSimpleView">
              <leaderboard-simple-view
                v-for="(project, index) in leaderboardProjects"
                :project="project"
                :key="project.id"
                :rank="index + 1"
                :round="roundInfo"
              ></leaderboard-simple-view>
            </div>
            <div v-else>
              <leaderboard-detail-view
                :projects="leaderboardProjects"
                :round="roundInfo"
              ></leaderboard-detail-view>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LeaderboardDetailView from '@/components/LeaderboardDetailView.vue'
import LeaderboardSimpleView from '@/components/LeaderboardSimpleView.vue'
import Loader from '@/components/Loader.vue'
import { useAppStore, useRoundStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { ready } = storeToRefs(useAppStore())
const {
  nativeTokenAddress,
  nativeTokenSymbol,
  nativeTokenDecimals,
  voiceCreditFactor,
  leaderboardProjects,
} = storeToRefs(useRoundStore())

const roundInfo = computed(() => ({
  nativeTokenAddress: nativeTokenAddress.value,
  nativeTokenSymbol: nativeTokenSymbol.value,
  nativeTokenDecimals: nativeTokenDecimals.value,
  voiceCreditFactor: voiceCreditFactor.value,
}))

const isSimpleView = ref(true)
function toggleView() {
  isSimpleView.value = !isSimpleView.value
}
</script>

<style lang="scss" scoped>
@import '../styles/vars';
@import '../styles/theme';

.hr {
  grid-area: hr;
  width: 100%;
  border-bottom: 1px solid $border-light;
  margin-bottom: 2rem;
}

.info {
  background: var(--bg-secondary-highlight);
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin-top: 2rem;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
