<template>
  <div>
    <h1 class="page-title">Settings</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">School Information</h2>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">School Name</label>
            <InputText v-model="settings.school_name" class="w-full" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">School Address</label>
            <Textarea v-model="settings.school_address" rows="2" class="w-full" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Academic Year</label>
            <InputText v-model="settings.academic_year" class="w-full" />
          </div>
          <Button label="Save Settings" icon="pi pi-save" @click="saveSettings" :loading="saving" />
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Email Configuration (SMTP)</h2>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">SMTP Host</label>
            <InputText v-model="settings.smtp_host" class="w-full" placeholder="smtp.gmail.com" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">SMTP Port</label>
            <InputNumber v-model="settings.smtp_port" class="w-full" :min="1" :max="65535" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">SMTP User</label>
            <InputText v-model="settings.smtp_user" class="w-full" placeholder="your@email.com" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">SMTP Password</label>
            <InputText v-model="settings.smtp_pass" class="w-full" type="password" placeholder="App password" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">From Address</label>
            <InputText v-model="settings.smtp_from" class="w-full" placeholder="noreply@school.com" />
          </div>
          <div class="flex items-center gap-2">
            <InputSwitch v-model="settings.smtp_secure" />
            <label class="text-sm">Use SSL/TLS (port 465)</label>
          </div>
          <div class="flex gap-2">
            <Button label="Save Email Config" icon="pi pi-save" @click="saveSettings" :loading="saving" />
            <Button label="Test Email" icon="pi pi-send" class="p-button-outlined" @click="showTestDialog = true" />
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold mb-4">System Information</h2>
        <div class="space-y-3">
          <div class="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <span class="text-gray-500">Version</span>
            <span class="font-medium">1.0.0</span>
          </div>
          <div class="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <span class="text-gray-500">Database</span>
            <span class="font-medium">PostgreSQL</span>
          </div>
          <div class="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <span class="text-gray-500">Environment</span>
            <Tag :value="'Development'" severity="info" />
          </div>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="showTestDialog" header="Test Email" :modal="true" class="w-full md:w-1/3">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Send test to</label>
          <InputText v-model="testEmail" class="w-full" placeholder="recipient@example.com" />
        </div>
        <Button label="Send Test" icon="pi pi-send" @click="sendTestEmail" :loading="testing" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../utils/axios'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const settings = reactive({
  school_name: '', school_address: '', academic_year: '',
  smtp_host: '', smtp_port: 587, smtp_user: '', smtp_pass: '', smtp_from: '', smtp_secure: false,
})
const saving = ref(false)
const showTestDialog = ref(false)
const testEmail = ref('')
const testing = ref(false)

const saveSettings = async () => {
  saving.value = true
  try {
    const payload = { ...settings }
    await api.put('/settings', payload)
    toast.add({ severity: 'success', summary: 'Settings saved', life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message, life: 3000 })
  } finally { saving.value = false }
}

const sendTestEmail = async () => {
  if (!testEmail.value) return
  testing.value = true
  try {
    await api.post('/email/test', { to: testEmail.value })
    toast.add({ severity: 'success', summary: 'Test email sent', life: 3000 })
    showTestDialog.value = false
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Failed to send', life: 3000 })
  } finally { testing.value = false }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/settings')
    if (data.success) {
      Object.assign(settings, data.data)
      if (data.data.smtp_secure === 'true') settings.smtp_secure = true
      if (data.data.smtp_port) settings.smtp_port = parseInt(data.data.smtp_port, 10)
    }
  } catch { /* ignore */ }
})
</script>
