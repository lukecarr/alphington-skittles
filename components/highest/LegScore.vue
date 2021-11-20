<template>
  <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
    <dt class="text-sm font-medium text-gray-500 truncate">
      Highest Leg Score
    </dt>
    <dd class="mt-3 text-3xl font-bold text-gray-900">
      {{ leg }}
    </dd>
    <dt class="mt-1 text-base font-semibold text-gray-500 truncate">
      <strong>{{ teamName }}</strong> vs {{ opponentName }} ● {{ date }}
    </dt>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import type { Team } from '@prisma/client'

@Component({
  name: 'HighestLegScore',
  fetchOnServer: false,
})
export default class HighestLegScore extends Vue {
  leg = 0
  score = 0
  team?: Team
  opponent?: Team
  date = ''

  get teamName() {
    return this.team?.name || ''
  }

  get opponentName() {
    return this.opponent?.name || ''
  }

  async fetch() {
    const { leg, score, team, opponent, date } = await this.$axios.$get('/.netlify/functions/highest-leg')
    this.leg = leg
    this.score = score
    this.team = team
    this.opponent = opponent
    this.date = date
  }
}
</script>