<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Lost & Found - Admin Review</h1>
      <div class="flex gap-2">
        <Tag v-for="(count, key) in stats" :key="key" class="text-sm">
          <span class="capitalize">{{ key }}: {{ count }}</span>
        </Tag>
      </div>
    </div>

    <div class="card">
      <TabView>
        <TabPanel header="Pending Review">
          <DataTable :value="pendingItems" :loading="loading" :paginator="true" :rows="10">
            <Column field="itemName" header="Item" sortable></Column>
            <Column field="category" header="Category" sortable>
              <template #body="{ data }"><Tag :value="data.category" /></template>
            </Column>
            <Column field="location" header="Location" sortable></Column>
            <Column field="dateLost" header="Date Lost" sortable></Column>
            <Column header="Reported By">
              <template #body="{ data }">{{ data.reporter?.firstName }} {{ data.reporter?.lastName }}</template>
            </Column>
            <Column header="Actions" style="width:220px">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <Button icon="pi pi-check" class="p-button-rounded p-button-success p-button-sm" @click="reviewItem(data.id, 'approved')" v-tooltip.top="'Approve'" />
                  <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-sm" @click="rejectDialog(data)" v-tooltip.top="'Reject'" />
                  <Button icon="pi pi-eye" class="p-button-rounded p-button-info p-button-sm" @click="viewItem(data)" v-tooltip.top="'View'" />
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel header="All Reports">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Dropdown v-model="filterStatus" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Filter by Status" class="w-full" @change="loadAll" />
          </div>
          <DataTable :value="allItems" :loading="loadingAll" :paginator="true" :rows="10" :totalRecords="totalAll" @page="onAllPage">
            <Column field="itemName" header="Item" sortable></Column>
            <Column field="status" header="Status" sortable>
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
    </div>

    <Dialog v-model:visible="showViewDialog" :header="viewData?.itemName" :modal="true" class="w-full md:w-1/2">
      <div v-if="viewData" class="space-y-4">
        <Tag :value="viewData.status" :severity="viewData.status === 'approved' ? 'success' : 'danger'" />
        <p>{{ viewData.description }}</p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="text-gray-500">Location:</span><p>{{ viewData.location }}</p></div>
          <div><span class="text-gray-500">Date Lost:</span><p>{{ viewData.dateLost }}</p></div>
          <div><span class="text-gray-500">Contact:</span><p>{{ viewData.contactInfo || 'N/A' }}</p></div>
          <div><span class="text-gray-500">Reporter:</span><p>{{ viewData.reporter?.firstName }} {{ viewData.reporter?.lastName }} ({{ viewData.reporter?.email }})</p></div>
        </div>
        <div class="flex gap-2 justify-end mt-4">
          <Button label="Approve" icon="pi pi-check" class="p-button-success" @click="reviewItem(viewData.id, 'approved')" :loading="reviewing" />
          <Button label="Reject" icon="pi pi-times" class="p-button-danger" @click="rejectDialog(viewData)" />
        </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="showRejectDialog" header="Reject Report" :modal="true" class="w-full md:w-1/3">
      <div class="flex flex-col gap-4 p-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Reason for rejection</label>
          <Textarea v-model="rejectReason" rows="3" placeholder="Explain why this report is being rejected..." class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Cancel" class="p-button-text" @click="showRejectDialog = false" />
          <Button label="Reject" icon="pi pi-times" class="p-button-danger" @click="confirmReject" :loading="reviewing" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../utils/api'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const pendingItems = ref([])
const allItems = ref([])
const loading = ref(false)
const loadingAll = ref(false)
const reviewing = ref(false)
const totalAll = ref(0)
const allPage = ref(1)
const filterStatus = ref('')
const showViewDialog = ref(false)
const showRejectDialog = ref(false)
const viewData = ref(null)
const rejectTarget = ref(null)
const rejectReason = ref('')
const stats = ref({ pending: 0, approved: 0, rejected: 0, resolved: 0, total: 0 })

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Resolved', value: 'resolved' },
]

const loadPending = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/lost-items', { params: { status: 'pending', perPage: 100 } })
    if (data.success) pendingItems.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const loadAll = async () => {
  loadingAll.value = true
  try {
    const params = { page: allPage.value, perPage: 10 }
    if (filterStatus.value) params.status = filterStatus.value
    const { data } = await api.get('/lost-items', { params })
    if (data.success) {
      allItems.value = data.data
      totalAll.value = data.meta?.total || 0
    }
  } catch { /* ignore */ }
  finally { loadingAll.value = false }
}

const loadStats = async () => {
  try {
    const { data } = await api.get('/lost-items/stats')
    if (data.success) stats.value = data.data
  } catch { /* ignore */ }
}

const reviewItem = async (id, status) => {
  reviewing.value = true
  try {
    await api.patch(`/lost-items/${id}/review`, { status, adminRemark: '' })
    toast.add({ severity: 'success', summary: `Report ${status}`, life: 3000 })
    showViewDialog.value = false
    loadPending(); loadAll(); loadStats()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally { reviewing.value = false }
}

const rejectDialog = (item) => {
  rejectTarget.value = item
  rejectReason.value = ''
  showRejectDialog.value = true
}

const confirmReject = async () => {
  reviewing.value = true
  try {
    await api.patch(`/lost-items/${rejectTarget.value.id}/review`, {
      status: 'rejected',
      adminRemark: rejectReason.value || 'Report rejected by administration',
    })
    toast.add({ severity: 'info', summary: 'Report rejected', life: 3000 })
    showRejectDialog.value = false
    showViewDialog.value = false
    loadPending(); loadAll(); loadStats()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally { reviewing.value = false }
}

const viewItem = (item) => {
  viewData.value = item
  showViewDialog.value = true
}

const onAllPage = (e) => { allPage.value = e.page + 1; loadAll() }

onMounted(() => { loadPending(); loadAll(); loadStats() })
</script>
