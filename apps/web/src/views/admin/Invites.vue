<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Invite Management</h1>
      <Badge v-if="pendingCount > 0" :value="pendingCount" severity="danger" />
    </div>

    <div v-if="pendingCount > 0" class="card mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
      <div class="flex items-center gap-3">
        <i class="pi pi-bell text-yellow-600 text-2xl animate-pulse"></i>
        <div>
          <p class="font-semibold text-yellow-800 dark:text-yellow-200">New Access Request{{ pendingCount > 1 ? 's' : '' }}!</p>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">{{ pendingCount }} pending request{{ pendingCount > 1 ? 's' : '' }} waiting for your review</p>
        </div>
      </div>
    </div>

    <div class="card mb-6">
      <h2 class="text-lg font-semibold mb-4">Pending Access Requests</h2>
      <DataTable v-if="requests.length" :value="requests" :loading="loadingReq" :paginator="true" :rows="10">
        <Column header="Name">
          <template #body="{ data }">{{ data.firstName }} {{ data.lastName }}</template>
        </Column>
        <Column field="email" header="Email"></Column>
        <Column header="Role">
          <template #body="{ data }">
            <Tag :value="data.requestedRole?.replace('_', ' ')" />
          </template>
        </Column>
        <Column field="phone" header="Phone"></Column>
        <Column field="reason" header="Reason">
          <template #body="{ data }">{{ data.reason || '-' }}</template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button label="Approve" icon="pi pi-check" class="p-button-sm p-button-success" @click="approveRequest(data)" :loading="data._loading" />
              <Button label="Reject" icon="pi pi-times" class="p-button-sm p-button-danger" @click="rejectRequest(data)" :loading="data._loading" />
            </div>
          </template>
        </Column>
      </DataTable>
      <div v-else class="text-center py-8 text-gray-400">
        <i class="pi pi-inbox text-4xl mb-3 block"></i>
        <p>No pending access requests</p>
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold mb-4">Generated Invites</h2>
      <Button label="Generate Invite Link" icon="pi pi-plus" @click="showGenerate = true" class="mb-4" />

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
        <Column header="Status">
          <template #body="{ data }">
            <Tag :value="data.used ? 'Used' : 'Pending'" :severity="data.used ? 'success' : 'warning'" />
          </template>
        </Column>
        <Column header="Created">
          <template #body="{ data }">{{ data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '-' }}</template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="deleteInvite(data)" />
          </template>
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
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { supabase } from '../../utils/supabase'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const invites = ref([])
const requests = ref([])
const loading = ref(false)
const loadingReq = ref(false)
const showGenerate = ref(false)
const genLoading = ref(false)
const newInvite = reactive({ role: 'teacher', email: '' })
let realtimeChannel = null

const pendingCount = computed(() => requests.value.length)

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
    const { data } = await supabase.from('Invites').select('*').order('createdAt', { ascending: false })
    invites.value = data || []
  } catch (err) {
    console.error('loadInvites error:', err)
  }
  finally { loading.value = false }
}

const loadRequests = async () => {
  loadingReq.value = true
  try {
    const { data } = await supabase
      .from('LoginRequests')
      .select('*')
      .eq('status', 'pending')
      .order('createdAt', { ascending: false })
    requests.value = data || []
  } catch (err) {
    console.error('loadRequests error:', err)
  }
  finally { loadingReq.value = false }
}

const setupRealtime = () => {
  realtimeChannel = supabase
    .channel('access-requests-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'LoginRequests' },
      (payload) => {
        const newRow = payload.new
        if (newRow.status === 'pending') {
          requests.value = [newRow, ...requests.value]
          toast.add({
            severity: 'warn',
            summary: 'New Access Request!',
            detail: `${newRow.firstName || ''} ${newRow.lastName || ''} (${newRow.email}) requested access as ${newRow.requestedRole}`,
            life: 8000,
          })
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'LoginRequests' },
      (payload) => {
        const updated = payload.new
        const idx = requests.value.findIndex(r => r.id === updated.id)
        if (idx !== -1) {
          requests.value.splice(idx, 1)
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Invites' },
      (payload) => {
        invites.value = [payload.new, ...invites.value]
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'Invites' },
      (payload) => {
        invites.value = invites.value.filter(i => i.id !== payload.old.id)
      }
    )
    .subscribe()
}

const approveRequest = async (req) => {
  req._loading = true
  try {
    const token = crypto.randomUUID()
    await supabase.from('Invites').insert({
      email: req.email,
      role: req.requestedRole,
      token,
      used: false,
      createdBy: req.id,
    })
    await supabase.from('LoginRequests').update({
      status: 'approved',
      reviewedAt: new Date().toISOString(),
    }).eq('id', req.id)
    toast.add({ severity: 'success', summary: 'Approved', detail: `Invite link: ${getInviteUrl(token)}`, life: 8000 })
    loadRequests()
    loadInvites()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally { req._loading = false }
}

const rejectRequest = async (req) => {
  req._loading = true
  try {
    await supabase.from('LoginRequests').update({
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
    }).eq('id', req.id)
    toast.add({ severity: 'warn', summary: 'Rejected', detail: `Request from ${req.email} rejected`, life: 3000 })
    loadRequests()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally { req._loading = false }
}

const deleteInvite = async (invite) => {
  try {
    await supabase.from('Invites').delete().eq('id', invite.id)
    toast.add({ severity: 'success', summary: 'Deleted', life: 2000 })
    loadInvites()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  }
}

const generateInvite = async () => {
  if (!newInvite.role) return
  genLoading.value = true
  try {
    const token = crypto.randomUUID()
    await supabase.from('Invites').insert({
      email: newInvite.email || '',
      role: newInvite.role,
      token,
      used: false,
    })
    toast.add({ severity: 'success', summary: 'Invite link generated', detail: getInviteUrl(token), life: 8000 })
    showGenerate.value = false
    newInvite.role = 'teacher'
    newInvite.email = ''
    loadInvites()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally { genLoading.value = false }
}

onMounted(() => {
  loadInvites()
  loadRequests()
  setupRealtime()
})

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
})
</script>
