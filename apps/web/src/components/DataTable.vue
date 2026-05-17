<template>
  <div class="card overflow-hidden">
    <div v-if="$slots.header" class="mb-5">
      <slot name="header" />
    </div>

    <div v-if="loading" class="space-y-3 py-4">
      <div v-for="i in 5" :key="i" class="flex gap-4 animate-pulse">
        <div v-for="j in 4" :key="j" class="skeleton-warm h-12 flex-1"></div>
      </div>
    </div>

    <div v-else-if="value.length === 0" class="empty-warm">
      <div class="empty-warm-icon">
        <i class="pi pi-inbox text-3xl text-[#b5b0a8]"></i>
      </div>
      <h3 class="text-lg font-bold text-[#2d2a26] dark:text-[#f5f0ea] mb-2">No data found</h3>
      <p class="text-[#8a857d] max-w-sm">
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
    >
      <template #empty>
        <div class="empty-warm py-12">
          <div class="empty-warm-icon">
            <i class="pi pi-inbox text-3xl text-[#b5b0a8]"></i>
          </div>
          <h3 class="text-lg font-bold text-[#2d2a26] dark:text-[#f5f0ea] mb-2">No data found</h3>
          <p class="text-[#8a857d]">Try adjusting your search or filters</p>
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
