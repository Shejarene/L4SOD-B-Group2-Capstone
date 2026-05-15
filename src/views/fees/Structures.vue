<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Fee Structures</h1>
      <Button label="Add Fee Item" icon="pi pi-plus" @click="showDialog = true" />
    </div>
    <DataTable :value="fees" :loading="loading" :paginator="false">
      <Column field="name" header="Fee Item" sortable></Column>
      <Column field="class.name" header="Class" sortable></Column>
      <Column field="type" header="Type" sortable>
        <template #body="{ data }"><Tag :value="data.type" /></template>
      </Column>
      <Column field="amount" header="Amount" sortable>
        <template #body="{ data }">${{ data.amount }}</template>
      </Column>
      <Column field="frequency" header="Frequency" sortable></Column>
      <Column field="academicYear" header="Academic Year" sortable></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/axios'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const fees = ref([])
const loading = ref(false)
const showDialog = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await api.get('/fees/structures')
    if (data.success) fees.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>
