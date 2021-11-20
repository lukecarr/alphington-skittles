<template>
  <div>
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
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pld
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    W
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    D
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    L
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PF
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PA
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PD
                  </th>
                  <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(team, idx) in teams" :key="team.id" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ idx + 1 }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ team.name }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ pld(team.id) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ wins(team.id) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ draws(team.id) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ losses(team.id) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ pinsFor(team.id) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ pinsAgainst(team.id) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ pinsFor(team.id) - pinsAgainst(team.id) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ points(team.id) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <dl class="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-5">
      <HighestTeamScore />
      <HighestLegScore />
    </dl>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import type { Game, Team } from '@prisma/client'

@Component({
  name: 'League',
  head: {
    title: 'League Table',
  },
  layout: 'print',
  fetchOnServer: false,
  created() {
    this.$parent.$emit('setTitle', 'League Table')
  },
})
export default class League extends Vue {
  teams: Team[] = []
  results: (Game & {
    homeTeam: Team;
    awayTeam: Team;
    result: {
      homeTeamPins: number;
      awayTeamPins: number;
      homeTeamPoints: number;
      awayTeamPoints: number;
    };
  })[] = []

  async fetch() {
    const { teams } = await this.$axios.$get('/.netlify/functions/teams')
    this.teams = teams
    const { results } = await this.$axios.$get('/.netlify/functions/results')
    this.results = results
    this.teams.sort((a, b) => this.points(b.id) - this.points(a.id))
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

  pinsFor(teamId: number) {
    let pins = 0
    for (const game of this.results) {
      if (game.homeTeamId === teamId) pins += game.result.homeTeamPins
      else if (game.awayTeamId === teamId) pins += game.result.awayTeamPins
    }
    return pins
  }

  pinsAgainst(teamId: number) {
    let pins = 0
    for (const game of this.results) {
      if (game.homeTeamId === teamId) pins += game.result.awayTeamPins
      else if (game.awayTeamId === teamId) pins += game.result.homeTeamPins
    }
    return pins
  }

  points(teamId: number) {
    return this.results.filter(game => game.homeTeamId === teamId || game.awayTeamId === teamId).map(game => game.homeTeamId === teamId ? game.result.homeTeamPoints : game.result.awayTeamPoints).reduce((a, b) => a + b, 0)
  }
}
</script>
