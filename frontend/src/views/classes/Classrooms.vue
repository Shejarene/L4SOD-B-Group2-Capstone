<template>
  <div>
    <h1 class="page-title">Classrooms</h1>

    <div class="card mb-6">
      <div class="flex gap-4 mb-4">
        <div v-for="lvl in levels" :key="lvl.number">
          <Button
            :label="'Level ' + lvl.number"
            :class="selectedLevel === lvl.number ? 'p-button-primary' : 'p-button-outlined'"
            @click="selectedLevel = lvl.number"
            class="mr-2"
          />
        </div>
      </div>
    </div>

    <div v-if="filteredClassrooms.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="cls in filteredClassrooms" :key="cls.id" class="card hover:shadow-lg transition-shadow cursor-pointer">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ cls.name }}</h3>
            <p class="text-xs text-gray-500">{{ cls.trade?.fullName || cls.trade?.name }}</p>
          </div>
          <Tag :value="'Level ' + cls.level?.number" :severity="cls.level?.number === 3 ? 'info' : cls.level?.number === 4 ? 'success' : 'warning'" />
        </div>
        
        <div class="mb-4">
          <p class="text-xs font-semibold text-gray-400 uppercase mb-2">Sections</p>
          <div class="flex flex-wrap gap-2">
            <Tag v-for="sec in cls.sections" :key="sec.id" :value="sec.name" severity="secondary" class="cursor-pointer">
              <template #default>
                <div class="flex items-center gap-2">
                  <span>{{ sec.name }}</span>
                  <i v-if="canManage" class="pi pi-times text-[10px] hover:text-red-500" @click.stop="deleteSection(sec.id)"></i>
                </div>
              </template>
            </Tag>
            <Button v-if="canManage" icon="pi pi-plus" class="p-button-text p-button-sm p-0 h-6 w-6" @click.stop="openAddSection(cls)" />
          </div>
        </div>

        <div class="flex justify-between text-sm text-gray-500">
          <span><i class="pi pi-user mr-1"></i>{{ cls.students?.length || 0 }} students</span>
        </div>
      </div>
    </div>

    <!-- Add Section Dialog -->
    <Dialog v-model:visible="showAddSection" header="Add Section" :modal="true" class="w-full max-w-md">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Section Name (e.g. A, B, North)</label>
          <InputText v-model="newSection.name" class="w-full" placeholder="Enter section name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Section Code</label>
          <InputText v-model="newSection.code" class="w-full" placeholder="e.g. SEC-A" />
        </div>
        <Button label="Create Section" :loading="saving" @click="saveSection" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../utils/axios'
import { useAuthStore } from '../../stores/auth'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = useAuthStore()
const levels = ref([])
const classrooms = ref([])
const selectedLevel = ref(3)

const showAddSection = ref(false)
const saving = ref(false)
const selectedClass = ref(null)
const newSection = ref({ name: '', code: '' })

const canManage = computed(() => ['super_admin', 'admin', 'dos'].includes(authStore.user?.role))

const filteredClassrooms = computed(() =>
  classrooms.value.filter(c => c.level?.number === selectedLevel.value)
)

const openAddSection = (cls) => {
  selectedClass.value = cls
  newSection.value = { name: '', code: cls.code + '-' }
  showAddSection.value = true
}

const saveSection = async () => {
  if (!newSection.value.name || !newSection.value.code) return
  saving.value = true
  try {
    await api.post('/sections', { ...newSection.value, classId: selectedClass.value.id })
    toast.add({ severity: 'success', summary: 'Success', detail: 'Section added', life: 3000 })
    showAddSection.value = false
    loadData()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message, life: 3000 })
  } finally { saving.value = false }
}

const deleteSection = async (id) => {
  if (!confirm('Are you sure you want to delete this section?')) return
  try {
    await api.delete(`/sections/${id}`)
    toast.add({ severity: 'success', summary: 'Deleted', life: 3000 })
    loadData()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message, life: 3000 })
  }
}

const loadData = async () => {
  try {
    const [clsRes, lvlRes] = await Promise.all([
      api.get('/classes'),
      api.get('/school/levels'),
    ])
    if (clsRes.data.success) classrooms.value = clsRes.data.data
    if (lvlRes.data.success) levels.value = lvlRes.data.data
  } catch { /* ignore */ }
}

onMounted(loadData)
</script>
