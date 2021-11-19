<template>
  <main class="px-4 min-h-screen overflow-hidden">
    <div class="my-4">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
        Mens' Averages
      </h2>
      <div class="flex flex-row flex-row flex-wrap space-x-6">
        <p class="mt-2 text-sm font-medium text-gray-500">
          Accurate as of {{ today }}
        </p>
        <p class="mt-2 text-sm font-medium text-gray-500">
          Min. {{ min }} games played to qualify
        </p>
      </div>
    </div>
    <Table :cols="cols" :data="tableData" />
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  name: 'MensAverages',
  head: {
    title: 'Mens Averages',
  },
})
export default class MensAverages extends Vue {
  min = 5
  
  players: any[] = []

  cols = [
    { id: 'index', name: 'Pos' },
    { id: 'Player', name: 'Player' },
    { id: 'Team', name: 'Team' },
    { id: 'Played', name: 'Played' },
    { id: 'Average', name: 'Average' },
  ]

  get tableData() {
    return this.players.slice(0, 20).map((player) => {
      player.Average = Number.parseFloat(player.Average).toFixed(2)
      return player
    })
  }

  get today() {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
  }

  async fetch() {
    const { players } = await this.$axios.$get(`/.netlify/functions/averages?gender=male&min=${this.min}`)
    this.players = players
  }
}
</script>
