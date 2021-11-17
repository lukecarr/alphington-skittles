<template>
  <Tutorial/>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData({ $axios }) {
    return {
      hello: await $axios.$get('/.netlify/functions/hello')
    }
  }
})
</script>
