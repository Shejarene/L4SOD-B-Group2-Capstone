<template>
  <div>
    <h1 class="page-title">Communication</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Send Message</h2>
        <form @submit.prevent="sendMessage">
          <div class="flex flex-col gap-3">
            <Dropdown v-model="msg.receiverId" :options="users" optionLabel="label" optionValue="id" placeholder="Select Recipient" class="w-full" filter />
            <InputText v-model="msg.subject" placeholder="Subject" class="w-full" />
            <Textarea v-model="msg.body" placeholder="Type your message..." rows="4" class="w-full" />
            <Button type="submit" label="Send" icon="pi pi-send" :loading="sending" />
          </div>
        </form>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Recent Messages</h2>
        <div v-if="messages.length" class="space-y-3">
          <div v-for="m in messages" :key="m.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex justify-between items-start">
              <p class="font-medium text-sm">{{ m.sender?.firstName }} {{ m.sender?.lastName }}</p>
              <span class="text-xs text-gray-400">{{ new Date(m.createdAt).toLocaleDateString() }}</span>
            </div>
            <p class="text-sm font-medium mt-1">{{ m.subject }}</p>
            <p class="text-sm text-gray-500 truncate">{{ m.body }}</p>
          </div>
        </div>
        <p v-else class="text-gray-400 text-center py-4">No messages yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/api'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const users = ref([])
const messages = ref([])
const sending = ref(false)
const msg = ref({ receiverId: '', subject: '', body: '' })

const sendMessage = async () => {
  if (!msg.value.receiverId || !msg.value.body) return
  sending.value = true
  try {
    await api.post('/communication/messages', msg.value)
    toast.add({ severity: 'success', summary: 'Sent', life: 3000 })
    msg.value = { receiverId: '', subject: '', body: '' }
    loadMessages()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally { sending.value = false }
}

const loadMessages = async () => {
  try {
    const { data } = await api.get('/communication/messages', { params: { perPage: 10 } })
    if (data.success) messages.value = data.data
  } catch { /* ignore */ }
}

const loadUsers = async () => {
  try {
    const { data } = await api.get('/users', { params: { perPage: 100 } })
    if (data.success) {
      users.value = data.data.map(u => ({ id: u.id, label: `${u.firstName} ${u.lastName} (${u.role})` }))
    }
  } catch { /* ignore */ }
}

onMounted(() => { loadMessages(); loadUsers() })
</script>
