<template>
  <main class="px-4 min-h-screen overflow-hidden">
    <div class="my-4">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
        Nines League
      </h2>
      <p class="mt-2 text-sm font-medium text-gray-500">
        Accurate as of {{ today }}
      </p>
    </div>
    <Table :cols="cols" :data="tableData" />
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { format } from 'date-fns'

@Component({
  name: 'Nines',
  head: {
    title: 'Nines League',
  },
  layout: 'print',
  fetchOnServer: false,
})
export default class Nines extends Vue {
  players: any[] = []

  cols = [
    { id: 'index', name: 'Pos' },
    { id: 'Player', name: 'Player' },
    { id: 'Team', name: 'Team' },
    { id: 'Played', name: 'Played' },
    { id: 'Nines', name: 'Nines' },
    { id: 'Spares', name: 'Spares' },
    { id: 'Total', name: 'Total' }
  ]

  get today() {
    return format(new Date(), "EEE do MMM")
  }

  get tableData() {
    return this.players.slice(0, 20)
  }

  async fetch() {
    const { players } = await this.$axios.$get('/.netlify/functions/nines-league')
    this.players = players
  }
}
</script>
