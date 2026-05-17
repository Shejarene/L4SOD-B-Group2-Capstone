<template>
  <div>
    <h1 class="page-title">Attendance Report</h1>
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Dropdown v-model="filters.classId" :options="classes" optionLabel="name" optionValue="id" placeholder="Select Class" class="w-full" />
        <Calendar v-model="filters.startDate" dateFormat="yy-mm-dd" placeholder="Start Date" class="w-full" />
        <Calendar v-model="filters.endDate" dateFormat="yy-mm-dd" placeholder="End Date" class="w-full" />
        <Button label="Generate Report" icon="pi pi-file" @click="generateReport" :loading="loading" />
      </div>
    </div>

    <div v-if="records.length" class="card mt-6">
      <DataTable :value="records" :paginator="true" :rows="20">
        <Column header="Student">
          <template #body="{ data }">{{ data.student?.user?.firstName }} {{ data.student?.user?.lastName }}</template>
        </Column>
        <Column field="date" header="Date"></Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="data.status === 'present' ? 'success' : data.status === 'late' ? 'warning' : 'danger'" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../utils/api'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const classes = ref([])
const records = ref([])
const loading = ref(false)
const filters = reactive({ classId: '', startDate: '', endDate: '' })

const generateReport = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/attendance/report', { params: filters })
    if (data.success) records.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
}

onMounted(async () => {
  const { data } = await api.get('/classes')
  if (data.success) classes.value = data.data
})
</script>
