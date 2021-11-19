<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="col in cols" :key="col.id" scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{col.name}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in data" :key="row.id || idx" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                <td v-for="col in cols" :key="col.id" class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ row[col.id] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component({
  name: 'Table',
})
export default class Table extends Vue {
  @Prop({ default: [] })
  readonly cols!: { id: string; name: string }[]

  @Prop({ default: [] })
  readonly data!: any[]
}
</script>