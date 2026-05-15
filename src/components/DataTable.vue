<template>
  <div class="card">
    <div v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </div>
    <DataTable
      :value="value"
      :loading="loading"
      :paginator="paginator"
      :rows="rows"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="[10, 20, 50]"
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
      :scrollable="true"
      scrollHeight="flex"
      class="p-datatable-sm"
      stripedRows
      showGridlines
    >
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
