<template>
  <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
    <dt class="text-sm font-medium text-gray-500 truncate">
      Highest Team Score
    </dt>
    <dd class="mt-3 text-3xl font-bold text-gray-900">
      {{ score }}
    </dd>
    <dt class="mt-1 text-base text-gray-500 truncate">
      <span class="font-semibold">{{ teamName }}</span> vs {{ opponentName }} ● {{ date }}
    </dt>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import type { Team } from '@prisma/client'

@Component({
  name: 'HighestTeamScore',
})
export default class HighestTeamScore extends Vue {
  score = 0
  team: Team | null = null
  opponent: Team | null = null
  date = ''

  get teamName() {
    return this.team?.name || ''
  }

  get opponentName() {
    return this.opponent?.name || ''
  }

  async fetch() {
    const { score, team, opponent, date } = await this.$axios.$get('/.netlify/functions/highest-team-score')
    this.score = score
    this.team = team
    this.opponent = opponent
    this.date = date
  }
}
</script>