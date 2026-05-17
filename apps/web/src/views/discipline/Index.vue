<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Discipline</h1>
      <Button label="Add Record" icon="pi pi-plus" @click="showDialog = true" />
    </div>

    <DataTable :value="records" :loading="loading" :totalRecords="totalRecords" :rows="perPage" @page="onPage">
      <Column header="Student">
        <template #body="{ data }">{{ data.student?.user?.firstName }} {{ data.student?.user?.lastName }}</template>
      </Column>
      <Column field="type" header="Type" sortable>
        <template #body="{ data }">
          <Tag :value="data.type" :severity="data.type === 'positive' ? 'success' : 'danger'" />
        </template>
      </Column>
      <Column field="incident" header="Incident" sortable></Column>
      <Column field="action" header="Action" sortable></Column>
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag :value="data.status" :severity="data.status === 'resolved' ? 'success' : data.status === 'open' ? 'warning' : 'info'" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/api'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const records = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const page = ref(1)
const perPage = ref(10)
const showDialog = ref(false)

const loadRecords = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/discipline', { params: { page: page.value, perPage: perPage.value } })
    if (data.success) {
      records.value = data.data
      totalRecords.value = data.meta?.total || 0
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const onPage = (e) => { page.value = e.page + 1; perPage.value = e.rows; loadRecords() }
onMounted(loadRecords)
</script>
