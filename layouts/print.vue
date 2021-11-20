<template>
  <main class="max-w-7xl px-4 mx-auto">
    <div class="border-b border-gray-200 print:hidden">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Printouts
      </h3>
      <nav class="mt-4 -mb-px flex space-x-8">
        <nuxt-link v-for="tab in tabs" :key="tab.name" :to="tab.to" exact-active-class="border-indigo-500 text-indigo-600" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm" :aria-current="tab.current ? 'page' : undefined">
          {{ tab.name }}
        </nuxt-link>
      </nav>
    </div>
    <div class="my-4">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
        {{ title }}
      </h2>
      <p class="mt-2 text-sm font-medium text-gray-500">
        Accurate as of {{ today }}
      </p>
    </div>
    <nuxt @setTitle="setTitle($event)" />
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { format } from 'date-fns'

@Component({ name: 'PrintLayout' })
export default class PrintLayout extends Vue {
  tabs = [
    {
      name: 'League Table',
      to: '/print/league',
    },
    {
      name: 'Nines League',
      to: '/print/nines',
    },
    {
      name: 'Mens\' Averages',
      to: '/print/averages/mens',
    },
    {
      name: 'Ladies\' Averages',
      to: '/print/averages/ladies',
    },
  ]

  title = ''

  setTitle(newTitle: string) {
    this.title = newTitle
  }

  get today() {
    return format(new Date(), "EEE do MMM")
  }
}
</script>