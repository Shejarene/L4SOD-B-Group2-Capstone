<template>
  <div class="card overflow-hidden">
    <div v-if="$slots.header" class="mb-5">
      <slot name="header" />
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="flex gap-4 animate-pulse">
        <div v-for="j in 4" :key="j" class="skeleton h-10 flex-1 rounded-lg"></div>
      </div>
    </div>

    <div v-else-if="value.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <i class="pi pi-inbox text-3xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No data found</h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-sm">
        <slot name="empty-message">There are no records to display. Try adjusting your filters or add new data.</slot>
      </p>
      <slot name="empty-action" />
    </div>

    <DataTable
      v-else
      :value="value"
      :paginator="paginator"
      :rows="rows"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="[10, 20, 50, 100]"
      :lazy="lazy"
      @page="onPage"
      @sort="onSort"
      @filter="onFilter"
      :sortField="sortField"
      :sortOrder="sortOrder"
      :filterDisplay="filterDisplay"
      :globalFilterFields="globalFilterFields"
      :selection="selection"
      @update:selection="$emit('update:selection', $event)"
      :dataKey="dataKey"
      :responsiveLayout="'scroll'"
      stripedRows
      class="p-datatable-sm"
    >
      <template #empty>
        <div class="empty-state py-12">
          <div class="empty-state-icon">
            <i class="pi pi-inbox text-3xl text-gray-400"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No data found</h3>
          <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      </template>
      <slot />
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable'

const props = defineProps({
  value: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  paginator: { type: Boolean, default: true },
  rows: { type: Number, default: 10 },
  totalRecords: { type: Number, default: 0 },
  lazy: { type: Boolean, default: true },
  sortField: { type: String, default: '' },
  sortOrder: { type: Number, default: -1 },
  filterDisplay: { type: String, default: '' },
  globalFilterFields: { type: Array, default: () => [] },
  selection: { type: [Array, Object], default: null },
  dataKey: { type: String, default: 'id' },
})

const emit = defineEmits(['page', 'sort', 'filter', 'update:selection'])

const onPage = (event) => emit('page', event)
const onSort = (event) => emit('sort', event)
const onFilter = (event) => emit('filter', event)
</script>
