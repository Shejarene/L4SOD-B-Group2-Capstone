<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Subjects</h1>
      <div class="flex gap-2">
        <Button label="Allocate Subject" icon="pi pi-plus" class="p-button-outlined" @click="showAllocate = true" />
        <Button label="Add Subject" icon="pi pi-plus" @click="showDialog = true" />
      </div>
    </div>

    <DataTable :value="subjects" :loading="loading" :paginator="false">
      <Column field="name" header="Name" sortable></Column>
      <Column field="code" header="Code" sortable></Column>
      <Column field="class.name" header="Class" sortable></Column>
      <Column field="department.name" header="Department" sortable></Column>
      <Column field="coefficient" header="Coefficient" sortable></Column>
      <Column field="type" header="Type" sortable>
        <template #body="{ data }">
          <Tag :value="data.type" :severity="data.type === 'core' ? 'info' : data.type === 'elective' ? 'warning' : 'success'" />
        </template>
      </Column>
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

const subjects = ref([])
const loading = ref(false)
const showDialog = ref(false)
const showAllocate = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await api.get('/subjects')
    if (data.success) subjects.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>
