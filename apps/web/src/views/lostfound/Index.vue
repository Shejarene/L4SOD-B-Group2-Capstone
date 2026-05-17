<template>
  <div>
    <h1 class="page-title">Lost & Found</h1>

    <TabView>
      <TabPanel header="Report Missing Item">
        <div class="card max-w-2xl">
          <form @submit.prevent="submitReport">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1 md:col-span-2">
                <label class="text-sm font-medium">Item Name <span class="text-red-500">*</span></label>
                <InputText v-model="form.itemName" placeholder="e.g. Black Calculator" class="w-full" :class="{ 'p-invalid': errors.itemName }" />
                <small v-if="errors.itemName" class="text-red-500">{{ errors.itemName }}</small>
              </div>
              <div class="flex flex-col gap-1 md:col-span-2">
                <label class="text-sm font-medium">Description <span class="text-red-500">*</span></label>
                <Textarea v-model="form.description" placeholder="Describe the item in detail..." rows="3" class="w-full" :class="{ 'p-invalid': errors.description }" />
                <small v-if="errors.description" class="text-red-500">{{ errors.description }}</small>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Category</label>
                <Dropdown v-model="form.category" :options="categories" optionLabel="label" optionValue="value" placeholder="Select category" class="w-full" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Date Lost <span class="text-red-500">*</span></label>
                <Calendar v-model="form.dateLost" dateFormat="yy-mm-dd" :maxDate="today" class="w-full" :class="{ 'p-invalid': errors.dateLost }" />
                <small v-if="errors.dateLost" class="text-red-500">{{ errors.dateLost }}</small>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Location <span class="text-red-500">*</span></label>
                <InputText v-model="form.location" placeholder="e.g. Science Lab, Cafeteria" class="w-full" :class="{ 'p-invalid': errors.location }" />
                <small v-if="errors.location" class="text-red-500">{{ errors.location }}</small>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Contact Info</label>
                <InputText v-model="form.contactInfo" placeholder="Phone or email" class="w-full" />
              </div>
            </div>
            <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm text-yellow-700 dark:text-yellow-300">
              <i class="pi pi-info-circle mr-2"></i>
              Your report will be reviewed by the administration before being published.
            </div>
            <Button type="submit" label="Submit Report" icon="pi pi-send" class="mt-4" :loading="submitting" />
          </form>
        </div>
      </TabPanel>

      <TabPanel header="Browse Lost Items">
        <div class="card mb-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dropdown v-model="filters.category" :options="categories" optionLabel="label" optionValue="value" placeholder="All Categories" class="w-full" @change="loadItems" />
            <Dropdown v-model="filters.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Status" class="w-full" @change="loadItems" />
            <Button label="Refresh" icon="pi pi-refresh" class="p-button-outlined" @click="loadItems" />
          </div>
        </div>

        <div v-if="!items.length && !loading" class="card text-center py-12 text-gray-400">
          <i class="pi pi-inbox text-5xl mb-4"></i>
          <p>No lost items reported yet</p>
        </div>

        <div v-if="items.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="item in items" :key="item.id" class="card hover:shadow-lg transition-shadow cursor-pointer" @click="selectedItem = item">
            <div class="flex items-start justify-between mb-3">
              <Tag :value="item.category" severity="info" />
              <Tag :value="item.status" :severity="item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : item.status === 'resolved' ? 'warn' : 'warning'" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ item.itemName }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{{ item.description }}</p>
            <div class="text-xs text-gray-400 space-y-1">
              <p><i class="pi pi-map-marker mr-1"></i>{{ item.location }}</p>
              <p><i class="pi pi-calendar mr-1"></i>{{ item.dateLost }}</p>
              <p v-if="item.reporter"><i class="pi pi-user mr-1"></i>Reported by {{ item.reporter.firstName }} {{ item.reporter.lastName }}</p>
            </div>
          </div>
        </div>

        <Paginator v-if="totalRecords > perPage" :rows="perPage" :totalRecords="totalRecords" @page="onPage" class="mt-4" />
      </TabPanel>

      <TabPanel header="My Reports">
        <DataTable :value="myReports" :loading="loadingMy" :totalRecords="totalMy" :rows="10" @page="onMyPage">
          <Column field="itemName" header="Item"></Column>
          <Column field="location" header="Location"></Column>
          <Column field="dateLost" header="Date Lost"></Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="data.status === 'approved' ? 'success' : data.status === 'rejected' ? 'danger' : data.status === 'resolved' ? 'warn' : 'warning'" />
            </template>
          </Column>
          <Column field="adminRemark" header="Admin Remark">
            <template #body="{ data }">{{ data.adminRemark || '-' }}</template>
          </Column>
        </DataTable>
      </TabPanel>
    </TabView>

    <Dialog v-model:visible="showItemDialog" :header="selectedItem?.itemName" :modal="true" class="w-full md:w-1/2">
      <div v-if="selectedItem" class="space-y-4">
        <div class="flex gap-2">
          <Tag :value="selectedItem.category" />
          <Tag :value="selectedItem.status" :severity="selectedItem.status === 'approved' ? 'success' : 'danger'" />
        </div>
        <p class="text-gray-700 dark:text-gray-300">{{ selectedItem.description }}</p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="text-gray-500">Location:</span><p>{{ selectedItem.location }}</p></div>
          <div><span class="text-gray-500">Date Lost:</span><p>{{ selectedItem.dateLost }}</p></div>
          <div><span class="text-gray-500">Contact:</span><p>{{ selectedItem.contactInfo || 'Not provided' }}</p></div>
          <div><span class="text-gray-500">Reported by:</span><p>{{ selectedItem.reporter?.firstName }} {{ selectedItem.reporter?.lastName }}</p></div>
        </div>
        <div v-if="selectedItem.adminRemark" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span class="text-sm font-medium">Admin Remark:</span>
          <p class="text-sm mt-1">{{ selectedItem.adminRemark }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import api from '../../utils/api'
import { useAuthStore } from '../../stores/auth'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import { useToast } from 'primevue/usetoast'

const auth = useAuthStore()
const toast = useToast()
const today = new Date()

const categories = [
  { label: 'All Categories', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Books', value: 'books' },
  { label: 'Stationery', value: 'stationery' },
  { label: 'Money', value: 'money' },
  { label: 'Jewelry', value: 'jewelry' },
  { label: 'Documents', value: 'documents' },
  { label: 'Other', value: 'other' },
]

const statuses = [
  { label: 'All Status', value: '' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Resolved', value: 'resolved' },
]

const form = reactive({
  itemName: '', description: '', category: 'other',
  location: '', dateLost: '', contactInfo: '',
})
const errors = reactive({})
const submitting = ref(false)

const items = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const page = ref(1)
const perPage = ref(12)
const selectedItem = ref(null)
const showItemDialog = computed({
  get: () => !!selectedItem.value,
  set: (val) => { if (!val) selectedItem.value = null },
})

const myReports = ref([])
const loadingMy = ref(false)
const totalMy = ref(0)
const myPage = ref(1)

const filters = reactive({ category: '', status: '' })

const loadItems = async () => {
  loading.value = true
  try {
    const params = { page: page.value, perPage: perPage.value }
    if (filters.category) params.category = filters.category
    if (filters.status) params.status = filters.status
    const { data } = await api.get('/lost-items', { params })
    if (data.success) {
      items.value = data.data
      totalRecords.value = data.meta?.total || 0
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const loadMyReports = async () => {
  loadingMy.value = true
  try {
    const { data } = await api.get('/lost-items/my-reports', { params: { page: myPage.value, perPage: 10 } })
    if (data.success) {
      myReports.value = data.data
      totalMy.value = data.meta?.total || 0
    }
  } catch { /* ignore */ }
  finally { loadingMy.value = false }
}

const submitReport = async () => {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.itemName) errors.itemName = 'Required'
  if (!form.description) errors.description = 'Required'
  if (!form.location) errors.location = 'Required'
  if (!form.dateLost) errors.dateLost = 'Required'
  if (Object.keys(errors).length) return

  submitting.value = true
  try {
    await api.post('/lost-items', form)
    toast.add({ severity: 'success', summary: 'Report submitted for review', life: 4000 })
    form.itemName = ''; form.description = ''; form.location = ''; form.dateLost = ''; form.contactInfo = ''; form.category = 'other'
    loadMyReports()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally { submitting.value = false }
}

const onPage = (e) => { page.value = e.page + 1; loadItems() }
const onMyPage = (e) => { myPage.value = e.page + 1; loadMyReports() }

onMounted(() => { loadItems(); loadMyReports() })
</script>
