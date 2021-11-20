<template>
  <Table :cols="cols" :data="tableData" />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component({
  name: 'Nines',
  head: {
    title: 'Nines League',
  },
  layout: 'print',
  fetchOnServer: false,
  created() {
    this.$parent.$emit('setTitle', 'Nines League')
  },
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

  get tableData() {
    return this.players.slice(0, 20)
  }

  async fetch() {
    const { players } = await this.$axios.$get('/.netlify/functions/nines-league')
    this.players = players
  }
}
</script>
