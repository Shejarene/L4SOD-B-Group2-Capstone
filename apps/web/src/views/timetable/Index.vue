<template>
  <div>
    <h1 class="page-title">Timetable</h1>

    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dropdown v-model="filters.classId" :options="classes" optionLabel="name" optionValue="id" placeholder="Select Class" class="w-full" />
        <Dropdown v-model="filters.dayOfWeek" :options="days" optionLabel="label" optionValue="value" placeholder="Select Day" class="w-full" />
        <Button label="Load Timetable" icon="pi pi-search" @click="loadTimetable" />
      </div>
    </div>

    <div v-if="entries.length" class="card">
      <DataTable :value="entries" :paginator="false">
        <Column field="dayOfWeek" header="Day">
          <template #body="{ data }">{{ dayNames[data.dayOfWeek] }}</template>
        </Column>
        <Column field="startTime" header="Start" sortable></Column>
        <Column field="endTime" header="End" sortable></Column>
        <Column field="subject.name" header="Subject"></Column>
        <Column header="Teacher">{{ data => data.teacher?.user?.firstName + ' ' + data.teacher?.user?.lastName }}</Column>
        <Column field="room" header="Room"></Column>
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
import Button from 'primevue/button'

const classes = ref([])
const entries = ref([])
const loading = ref(false)
const filters = reactive({ classId: '', dayOfWeek: '' })

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const days = dayNames.map((name, value) => ({ label: name, value })).filter(d => d.value !== 0)

const loadTimetable = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/timetable', { params: filters })
    if (data.success) entries.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
}

onMounted(async () => {
  const { data } = await api.get('/classes')
  if (data.success) classes.value = data.data
})
</script>
