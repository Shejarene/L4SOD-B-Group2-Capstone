<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Invite Management</h1>
      <Button label="Generate Invite Link" icon="pi pi-plus" @click="showGenerate = true" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="card text-center">
        <i class="pi pi-users text-3xl text-blue-600 mb-3"></i>
        <h3 class="text-lg font-semibold">Total Invites Sent</h3>
        <p class="text-3xl font-bold text-primary-600 mt-2">{{ invites.length }}</p>
      </div>
      <div class="card text-center">
        <i class="pi pi-check-circle text-3xl text-green-600 mb-3"></i>
        <h3 class="text-lg font-semibold">Accepted</h3>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ invites.filter(i => i.used).length }}</p>
      </div>
      <div class="card text-center">
        <i class="pi pi-hourglass text-3xl text-yellow-600 mb-3"></i>
        <h3 class="text-lg font-semibold">Pending</h3>
        <p class="text-3xl font-bold text-yellow-600 mt-2">{{ invites.filter(i => !i.used).length }}</p>
      </div>
    </div>

    <div class="card">
      <DataTable :value="invites" :loading="loading" :paginator="true" :rows="10">
        <Column header="Role">
          <template #body="{ data }">
            <Tag :value="data.role?.replace('_', ' ')" />
          </template>
        </Column>
        <Column field="email" header="Target Email"></Column>
        <Column header="Invite Link">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <InputText :value="getInviteUrl(data.token)" readonly class="w-64 text-xs" />
              <Button icon="pi pi-copy" class="p-button-text p-button-sm" @click="copyLink(data.token)" />
            </div>
          </template>
        </Column>
        <Column field="used" header="Status">
          <template #body="{ data }">
            <Tag :value="data.used ? 'Accepted' : 'Pending'" :severity="data.used ? 'success' : 'warning'" />
          </template>
        </Column>
        <Column field="createdAt" header="Created">
          <template #body="{ data }">{{ new Date(data.createdAt).toLocaleDateString() }}</template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="showGenerate" header="Generate Invite Link" :modal="true" class="w-full md:w-1/2">
      <form @submit.prevent="generateInvite">
        <div class="flex flex-col gap-4 p-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Target Role</label>
            <Dropdown v-model="newInvite.role" :options="roles" optionLabel="label" optionValue="value" placeholder="Select role" class="w-full" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Target Email (optional)</label>
            <InputText v-model="newInvite.email" placeholder="user@example.com" class="w-full" />
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <Button label="Cancel" class="p-button-text" @click="showGenerate = false" />
            <Button type="submit" label="Generate" icon="pi pi-send" :loading="genLoading" />
          </div>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../utils/axios'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const invites = ref([])
const loading = ref(false)
const showGenerate = ref(false)
const genLoading = ref(false)
const newInvite = reactive({ role: 'teacher', email: '' })

const roles = [
  { label: 'Teacher', value: 'teacher' },
  { label: 'Student', value: 'student' },
  { label: 'Parent', value: 'parent' },
  { label: 'Accountant', value: 'accountant' },
  { label: 'Discipline Master', value: 'discipline_master' },
  { label: 'DOS', value: 'dos' },
]

const getInviteUrl = (token) => `${window.location.origin}/signup/${token}`

const copyLink = async (token) => {
  try {
    await navigator.clipboard.writeText(getInviteUrl(token))
    toast.add({ severity: 'success', summary: 'Copied!', life: 2000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Failed to copy', life: 2000 })
  }
}

const loadInvites = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/auth/invites')
    if (data.success) invites.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const generateInvite = async () => {
  if (!newInvite.role) return
  genLoading.value = true
  try {
    await api.post('/auth/invites', newInvite)
    toast.add({ severity: 'success', summary: 'Invite link generated', life: 3000 })
    showGenerate.value = false
    newInvite.role = 'teacher'
    newInvite.email = ''
    loadInvites()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message, life: 3000 })
  } finally { genLoading.value = false }
}

onMounted(loadInvites)
</script>
