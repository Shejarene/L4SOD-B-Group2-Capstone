<template>
  <div>
    <h1 class="page-title">Fee Management</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card hover:shadow-md transition-shadow cursor-pointer" @click="router.push('/app/fees/structures')">
        <i class="pi pi-dollar text-3xl text-primary-600 mb-3"></i>
        <h3 class="text-lg font-semibold">Fee Structures</h3>
        <p class="text-gray-500 text-sm">Configure fee items per class</p>
      </div>
      <div class="card hover:shadow-md transition-shadow cursor-pointer" @click="router.push('/app/fees/payments')">
        <i class="pi pi-credit-card text-3xl text-green-600 mb-3"></i>
        <h3 class="text-lg font-semibold">Payments</h3>
        <p class="text-gray-500 text-sm">Record and view payments</p>
      </div>
      <div class="card">
        <i class="pi pi-file text-3xl text-purple-600 mb-3"></i>
        <h3 class="text-lg font-semibold">Generate Invoices</h3>
        <p class="text-gray-500 text-sm mb-3">Generate invoices for students</p>
        <div class="flex gap-2">
          <Dropdown v-model="invoiceGen.studentId" :options="students" optionLabel="label" optionValue="id" placeholder="Select Student" class="w-full" />
          <Button icon="pi pi-plus" label="Generate" @click="generateInvoices" :loading="genLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../utils/axios'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()
const students = ref([])
const invoiceGen = ref({ studentId: '' })
const genLoading = ref(false)

const generateInvoices = async () => {
  if (!invoiceGen.value.studentId) return
  genLoading.value = true
  try {
    await api.post('/fees/invoices/generate', { studentId: invoiceGen.value.studentId, academicYear: '2024/2025', term: 1 })
    toast.add({ severity: 'success', summary: 'Invoices generated', life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message, life: 3000 })
  } finally { genLoading.value = false }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/students', { params: { perPage: 100 } })
    if (data.success) {
      students.value = data.data.map(s => ({ id: s.id, label: `${s.user?.firstName} ${s.user?.lastName} (${s.admissionNumber})` }))
    }
  } catch { /* ignore */ }
})
</script>
