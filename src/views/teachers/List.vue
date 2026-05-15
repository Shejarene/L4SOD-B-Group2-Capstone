<template>
  <div>
    <DataTable :value="teachers" :loading="loading" :totalRecords="totalRecords" :rows="perPage" @page="onPage">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Teachers</h2>
          <Button label="Add Teacher" icon="pi pi-plus" @click="showAddDialog = true" />
        </div>
      </template>
      <Column field="staffNumber" header="Staff No" sortable></Column>
      <Column header="Name" sortable>
        <template #body="{ data }">
          <router-link :to="`/app/teachers/${data.id}`" class="text-primary-600 hover:underline font-medium">
            {{ data.user?.firstName }} {{ data.user?.lastName }}
          </router-link>
        </template>
      </Column>
      <Column field="department.name" header="Department" sortable></Column>
      <Column field="specialization" header="Specialization" sortable></Column>
      <Column field="employmentStatus" header="Status" sortable>
        <template #body="{ data }">
          <Tag :value="data.employmentStatus" :severity="data.employmentStatus === 'active' ? 'success' : 'warning'" />
        </template>
      </Column>
      <Column header="Actions" style="width:100px">
        <template #body="{ data }">
          <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="router.push(`/app/teachers/${data.id}`)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../utils/axios'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const router = useRouter()
const teachers = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const page = ref(1)
const perPage = ref(10)
const showAddDialog = ref(false)

const loadTeachers = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/teachers', { params: { page: page.value, perPage: perPage.value } })
    if (data.success) {
      teachers.value = data.data
      totalRecords.value = data.meta.total
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const onPage = (event) => {
  page.value = event.page + 1
  perPage.value = event.rows
  loadTeachers()
}

onMounted(loadTeachers)
</script>
