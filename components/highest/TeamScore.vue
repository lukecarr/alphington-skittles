<template>
  <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
    <dt class="text-sm font-medium text-gray-500 truncate">
      Highest Team Score
    </dt>
    <dd class="mt-3 text-3xl font-bold text-gray-900">
      {{ score }}
    </dd>
    <dt class="mt-1 text-base font-semibold text-gray-500 truncate">
      <strong>{{ team.name }}</strong> vs {{ opponent.name }} ● {{ date }}
    </dt>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import type { Team } from '@prisma/client'

@Component({
  name: 'HighestTeamScore',
  fetchOnServer: false,
})
export default class HighestTeamScore extends Vue {
  score = 0
  team?: Team
  opponent?: Team
  date = ''

  async fetch() {
    const { score, team, opponent, date } = await this.$axios.$get('/.netlify/functions/highest-team-score')
    this.score = score
    this.team = team
    this.opponent = opponent
    this.date = date
  }
}
</script>