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
          <template #body="{ data }">{{ data.first_name }} {{ data.last_name }}</template>
        </Column>
        <Column field="email" header="Email"></Column>
        <Column header="Role">
          <template #body="{ data }">
            <Tag :value="data.role?.replace('_', ' ')" />
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
            <Tag :value="data.status === 'approved' ? 'Accepted' : data.status === 'rejected' ? 'Rejected' : 'Pending'" :severity="data.status === 'approved' ? 'success' : data.status === 'rejected' ? 'danger' : 'warning'" />
          </template>
        </Column>
        <Column header="Created">
          <template #body="{ data }">{{ data.created_at ? new Date(data.created_at).toLocaleDateString() : '-' }}</template>
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
    let data
    const { data: rpcData, error: rpcErr } = await supabase.rpc('get_all_invites')
    if (rpcErr) {
      const { data: directData } = await supabase.from('invites').select('*').order('created_at', { ascending: false })
      data = directData || []
    } else {
      data = rpcData || []
    }
    invites.value = data.filter(i => !i.reason)
  } catch (err) {
    console.error('loadInvites error:', err)
  }
  finally { loading.value = false }
}

const loadRequests = async () => {
  loadingReq.value = true
  try {
    let data
    const { data: rpcData, error: rpcErr } = await supabase.rpc('get_pending_requests')
    if (rpcErr) {
      const { data: directData } = await supabase
        .from('invites')
        .select('*')
        .eq('status', 'pending')
        .not('reason', 'is', null)
        .order('created_at', { ascending: false })
      data = directData || []
    } else {
      data = rpcData || []
    }
    requests.value = data
  } catch (err) {
    console.error('loadRequests error:', err)
  }
  finally { loadingReq.value = false }
}

const setupRealtime = () => {
  realtimeChannel = supabase
    .channel('invites-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'invites' },
      (payload) => {
        const newRow = payload.new
        if (newRow.reason) {
          requests.value = [newRow, ...requests.value]
          toast.add({
            severity: 'warn',
            summary: 'New Access Request!',
            detail: `${newRow.first_name || ''} ${newRow.last_name || ''} (${newRow.email}) requested access as ${newRow.role}`,
            life: 8000,
          })
        } else {
          invites.value = [newRow, ...invites.value]
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'invites' },
      (payload) => {
        const updated = payload.new
        const idx = requests.value.findIndex(r => r.id === updated.id)
        if (idx !== -1) {
          requests.value.splice(idx, 1)
        }
        const idx2 = invites.value.findIndex(i => i.id === updated.id)
        if (idx2 !== -1) {
          invites.value[idx2] = updated
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'invites' },
      (payload) => {
        const deleted = payload.old
        requests.value = requests.value.filter(r => r.id !== deleted.id)
        invites.value = invites.value.filter(i => i.id !== deleted.id)
      }
    )
    .subscribe()
}

const approveRequest = async (req) => {
  req._loading = true
  try {
    const token = crypto.randomUUID()
    const { error: rpcErr } = await supabase.rpc('approve_access_request', { p_request_id: req.id, p_new_token: token })
    if (rpcErr) {
      const { error: directErr } = await supabase.from('invites').update({ status: 'approved', token }).eq('id', req.id)
      if (directErr) throw directErr
    }
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
    const { error: rpcErr } = await supabase.rpc('reject_access_request', { p_request_id: req.id })
    if (rpcErr) {
      const { error: directErr } = await supabase.from('invites').update({ status: 'rejected' }).eq('id', req.id)
      if (directErr) throw directErr
    }
    toast.add({ severity: 'warn', summary: 'Rejected', detail: `Request from ${req.email} rejected`, life: 3000 })
    loadRequests()
    loadInvites()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally { req._loading = false }
}

const deleteInvite = async (invite) => {
  try {
    const { error: rpcErr } = await supabase.rpc('delete_invite', { p_id: invite.id })
    if (rpcErr) {
      const { error: directErr } = await supabase.from('invites').delete().eq('id', invite.id)
      if (directErr) throw directErr
    }
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
    const { error: rpcErr } = await supabase.rpc('create_admin_invite', {
      p_email: newInvite.email,
      p_role: newInvite.role,
      p_token: token,
    })
    if (rpcErr) {
      const { error: directErr } = await supabase.from('invites').insert({
        email: newInvite.email || '',
        role: newInvite.role,
        token,
        status: 'pending',
      })
      if (directErr) throw directErr
    }
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
