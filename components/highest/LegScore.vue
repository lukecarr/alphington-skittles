<template>
  <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
    <dt class="text-sm font-medium text-gray-500 truncate">
      Highest Leg Score
    </dt>
    <dd class="mt-3 text-3xl font-bold text-gray-900">
      {{ leg }}
    </dd>
    <dt class="mt-1 text-base font-semibold text-gray-500 truncate">
      <strong>{{ team }}</strong> vs {{ opponent }} ● {{ date }}
    </dt>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { format } from 'date-fns'

@Component({
  name: 'HighestLegScore',
  fetchOnServer: false,
})
export default class HighestLegScore extends Vue {
  leg = 0
  team = ''
  opponent = ''
  date = ''

  async fetch() {
    const { leg, team, opponent, date } = await this.$axios.$get('/.netlify/functions/highest-leg')
    this.leg = leg
    this.team = team
    this.opponent = opponent
    this.date =  format(new Date(date), "eee do MMM")
  }
}
</script>