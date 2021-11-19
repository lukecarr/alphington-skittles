<template>
  <main class="px-4 min-h-screen overflow-hidden">
    <div class="my-4">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
        League Table
      </h2>
      <p class="mt-2 text-sm font-medium text-gray-500">
        Accurate as of {{ today }}
      </p>
    </div>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th v-for="col in cols" :key="col.name" scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{col.name}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(team, idx) in teams" :key="team.id" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ idx + 1 }}
                  </td>
                  <td v-for="col in cols" :key="col.name" class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ col.fn(team) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import type { Team } from '@prisma/client'

@Component({
  name: 'Nines',
  head: {
    title: 'Nines League',
  },
})
export default class Nines extends Vue {
  teams: any[] = []
  results: any[] = []

  cols: {
    name: string;
    fn: (team: Team) => any;
  }[] = [
    { name: 'Team', fn: ({ name }) => name },
    { name: 'Pld', fn: ({ id }) => this.pld(id) },
    { name: 'W', fn: ({ id }) => this.wins(id) },
    { name: 'D', fn: ({ id }) => this.draws(id) },
    { name: 'L', fn: ({ id }) => this.losses(id) },
    { name: 'Pts', fn: ({ id }) => this.points(id) },
  ]

  get today() {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
  }

  async fetch() {
    const { teams } = await this.$axios.$get('/.netlify/functions/teams')
    this.teams = teams
    const { results } = await this.$axios.$get('/.netlify/functions/results')
    this.results = results
    this.teams.sort((a, b) => this.points(b) - this.points(a))
  }

  pld(teamId: number) {
    return this.results.filter(game => game.homeTeamId === teamId || game.awayTeamId === teamId).length
  }

  wins(teamId: number) {
    return this.results.filter(game => game.homeTeamId === teamId && game.result.homeTeamPoints > game.result.awayTeamPoints || game.awayTeamId === teamId && game.result.awayTeamPoints > game.result.homeTeamPoints).length
  }

  draws(teamId: number) {
    return this.results.filter(game => (game.homeTeamId === teamId || game.awayTeamId === teamId) && game.result.homeTeamPoints === game.result.awayTeamPoints).length
  }

  losses(teamId: number) {
    return this.results.filter(game => game.homeTeamId === teamId && game.result.homeTeamPoints < game.result.awayTeamPoints || game.awayTeamId === teamId && game.result.awayTeamPoints < game.result.homeTeamPoints).length
  }

  points(teamId: number) {
    return this.results.filter(game => game.homeTeamId === teamId || game.awayTeamId === teamId).map(game => game.homeTeamId === teamId ? game.result.homeTeamPoints : game.result.awayTeamPoints).reduce((a, b) => a + b, 0)
  }
}
</script>
