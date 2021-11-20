<template>
  <Table :cols="cols" :data="tableData" />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  name: 'LadiesAverages',
  head: {
    title: 'Ladies\' Averages',
  },
  layout: 'print',
  created() {
    this.$parent.$emit('setTitle', 'Ladies\' Averages')
  },
})
export default class LadiesAverages extends Vue {
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
    return this.players.map((player) => {
      player.Average = Number.parseFloat(player.Average).toFixed(2)
      return player
    }).slice(0, 20)
  }

  async fetch() {
    const { players } = await this.$axios.$get(`/.netlify/functions/averages?gender=female&min=${this.min}`)
    this.players = players
  }
}
</script>
