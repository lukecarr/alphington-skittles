<template>
  <Tutorial/>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      teams: [],
    }
  },
  async fetch() {
    const { teams } = await this.$axios.$get('/.netlify/functions/teams')
    this.teams = teams
  }
})
</script>
