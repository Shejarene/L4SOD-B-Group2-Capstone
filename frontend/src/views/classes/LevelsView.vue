<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Levels & Trades</h1>
      <div class="flex gap-2">
        <Button v-if="canManage" label="Add Level" icon="pi pi-plus" @click="openLevelDialog()" />
        <Button v-if="canManage" label="Add Trade" icon="pi pi-plus" class="p-button-outlined" @click="openTradeDialog()" />
      </div>
    </div>

    <!-- Levels Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="level in levels" :key="level.id" class="card text-center group relative hover:shadow-lg transition-shadow">
        <div v-if="canManage" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm p-button-rounded" @click="openLevelDialog(level)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-rounded p-button-danger" @click="deleteLevel(level.id)" />
        </div>
        
        <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-primary-600">{{ level.number }}</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ level.name }}</h3>
        <p class="text-sm text-gray-500">{{ level.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2 justify-center">
          <Tag v-for="trade in trades" :key="trade.code" :value="trade.code" :class="level.number === 3 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : level.number === 4 ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'" />
        </div>
      </div>
    </div>

    <!-- Trades List -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Trades</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="trade in trades" :key="trade.code" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl relative group">
          <div v-if="canManage" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button icon="pi pi-pencil" class="p-button-text p-button-sm p-button-rounded" @click="openTradeDialog(trade)" />
            <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-rounded p-button-danger" @click="deleteTrade(trade.id)" />
          </div>

          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              :class="trade.code === 'SOD' ? 'bg-blue-600' : trade.code === 'NIT' ? 'bg-green-600' : 'bg-purple-600'">
              {{ trade.code }}
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">{{ trade.name }}</h4>
              <p class="text-xs text-gray-500">{{ trade.fullName }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">{{ trade.description }}</p>
        </div>
      </div>
    </div>

    <!-- Level Dialog -->
    <Dialog v-model:visible="levelDialog.show" :header="levelDialog.editMode ? 'Edit Level' : 'Add Level'" :modal="true" class="w-full max-w-md">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Level Number</label>
          <InputNumber v-model="levelDialog.form.number" class="w-full" :min="1" :max="10" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <InputText v-model="levelDialog.form.name" class="w-full" placeholder="e.g. Senior 4" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <Textarea v-model="levelDialog.form.description" class="w-full" rows="3" />
        </div>
        <Button :label="levelDialog.editMode ? 'Update' : 'Create'" :loading="levelDialog.loading" @click="saveLevel" />
      </div>
    </Dialog>

    <!-- Trade Dialog -->
    <Dialog v-model:visible="tradeDialog.show" :header="tradeDialog.editMode ? 'Edit Trade' : 'Add Trade'" :modal="true" class="w-full max-w-md">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Code</label>
          <InputText v-model="tradeDialog.form.code" class="w-full" placeholder="e.g. SOD" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <InputText v-model="tradeDialog.form.name" class="w-full" placeholder="e.g. Software Development" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Full Name</label>
          <InputText v-model="tradeDialog.form.fullName" class="w-full" placeholder="Extended name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <Textarea v-model="tradeDialog.form.description" class="w-full" rows="3" />
        </div>
        <Button :label="tradeDialog.editMode ? 'Update' : 'Create'" :loading="tradeDialog.loading" @click="saveTrade" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../utils/axios'
import { useAuthStore } from '../../stores/auth'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = useAuthStore()
const levels = ref([])
const trades = ref([])

const canManage = computed(() => ['super_admin', 'admin'].includes(authStore.user?.role))

const levelDialog = ref({
  show: false,
  editMode: false,
  loading: false,
  form: { number: null, name: '', description: '' }
})

const tradeDialog = ref({
  show: false,
  editMode: false,
  loading: false,
  form: { code: '', name: '', fullName: '', description: '' }
})

const openLevelDialog = (level = null) => {
  if (level) {
    levelDialog.value.form = { ...level }
    levelDialog.value.editMode = true
  } else {
    levelDialog.value.form = { number: null, name: '', description: '' }
    levelDialog.value.editMode = false
  }
  levelDialog.value.show = true
}

const saveLevel = async () => {
  levelDialog.value.loading = true
  try {
    if (levelDialog.value.editMode) {
      await api.put(`/school/levels/${levelDialog.value.form.id}`, levelDialog.value.form)
    } else {
      await api.post('/school/levels', levelDialog.value.form)
    }
    toast.add({ severity: 'success', summary: 'Success', life: 3000 })
    levelDialog.value.show = false
    loadData()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message, life: 3000 })
  } finally { levelDialog.value.loading = false }
}

const deleteLevel = async (id) => {
  if (!confirm('Delete this level?')) return
  try {
    await api.delete(`/school/levels/${id}`)
    loadData()
  } catch (err) { /* ignore */ }
}

const openTradeDialog = (trade = null) => {
  if (trade) {
    tradeDialog.value.form = { ...trade }
    tradeDialog.value.editMode = true
  } else {
    tradeDialog.value.form = { code: '', name: '', fullName: '', description: '' }
    tradeDialog.value.editMode = false
  }
  tradeDialog.value.show = true
}

const saveTrade = async () => {
  tradeDialog.value.loading = true
  try {
    if (tradeDialog.value.editMode) {
      await api.put(`/school/trades/${tradeDialog.value.form.id}`, tradeDialog.value.form)
    } else {
      await api.post('/school/trades', tradeDialog.value.form)
    }
    toast.add({ severity: 'success', summary: 'Success', life: 3000 })
    tradeDialog.value.show = false
    loadData()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message, life: 3000 })
  } finally { tradeDialog.value.loading = false }
}

const deleteTrade = async (id) => {
  if (!confirm('Delete this trade?')) return
  try {
    await api.delete(`/school/trades/${id}`)
    loadData()
  } catch (err) { /* ignore */ }
}

const loadData = async () => {
  try {
    const [lvlRes, trdRes] = await Promise.all([
      api.get('/school/levels'),
      api.get('/school/trades'),
    ])
    if (lvlRes.data.success) levels.value = lvlRes.data.data
    if (trdRes.data.success) trades.value = trdRes.data.data
  } catch { /* ignore */ }
}

onMounted(loadData)
</script>
