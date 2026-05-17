<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Payments</h1>
      <Button label="Record Payment" icon="pi pi-plus" @click="showDialog = true" />
    </div>

    <DataTable :value="payments" :loading="loading" :totalRecords="totalRecords" :rows="perPage" @page="onPage">
      <Column header="Receipt No" field="receiptNumber" sortable></Column>
      <Column header="Student">
        <template #body="{ data }">{{ data.student?.user?.firstName }} {{ data.student?.user?.lastName }}</template>
      </Column>
      <Column field="amount" header="Amount" sortable>
        <template #body="{ data }">${{ data.amount }}</template>
      </Column>
      <Column field="paymentMethod" header="Method" sortable></Column>
      <Column field="paymentDate" header="Date" sortable></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/api'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'

const payments = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const page = ref(1)
const perPage = ref(10)
const showDialog = ref(false)

const loadPayments = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/fees/payments', { params: { page: page.value, perPage: perPage.value } })
    if (data.success) {
      payments.value = data.data
      totalRecords.value = data.meta?.total || 0
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const onPage = (e) => { page.value = e.page + 1; perPage.value = e.rows; loadPayments() }
onMounted(loadPayments)
</script>
