<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <FormField label="First Name" name="firstName" :required="true" :error="errors.firstName">
        <InputText v-model="form.firstName" class="w-full" />
      </FormField>
      <FormField label="Last Name" name="lastName" :required="true" :error="errors.lastName">
        <InputText v-model="form.lastName" class="w-full" />
      </FormField>
      <FormField label="Email" name="email" :required="true" :error="errors.email">
        <InputText v-model="form.email" type="email" class="w-full" />
      </FormField>
      <FormField label="Phone" name="phone" :error="errors.phone">
        <InputText v-model="form.phone" class="w-full" />
      </FormField>
      <FormField label="Date of Birth" name="dateOfBirth">
        <Calendar v-model="form.dateOfBirth" dateFormat="yy-mm-dd" class="w-full" />
      </FormField>
      <FormField label="Gender" name="gender">
        <SelectButton v-model="form.gender" :options="['male', 'female', 'other']" />
      </FormField>
      <FormField label="Class" name="classId" :required="true" :error="errors.classId">
        <Dropdown v-model="form.classId" :options="classes" optionLabel="name" optionValue="id" placeholder="Select Class" class="w-full" />
      </FormField>
      <FormField label="Section" name="sectionId">
        <Dropdown v-model="form.sectionId" :options="sections" optionLabel="name" optionValue="id" placeholder="Select Section" class="w-full" />
      </FormField>
    </div>
    <div class="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
      <Button label="Cancel" class="p-button-text" @click="$emit('cancel')" />
      <Button type="submit" label="Save" :loading="saving" />
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import api from '../../utils/axios'
import FormField from '../../components/FormField.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import SelectButton from 'primevue/selectbutton'
import { useToast } from 'primevue/usetoast'

const emit = defineEmits(['saved', 'cancel'])
const toast = useToast()

const form = reactive({
  firstName: '', lastName: '', email: '', phone: '',
  dateOfBirth: null, gender: 'male', classId: '', sectionId: '',
})
const errors = reactive({})
const saving = ref(false)
const classes = ref([])
const sections = ref([])

const loadClasses = async () => {
  try {
    const { data } = await api.get('/classes')
    if (data.success) classes.value = data.data
  } catch { /* ignore */ }
}

watch(() => form.classId, async (val) => {
  if (val) {
    const cls = classes.value.find(c => c.id === val)
    sections.value = cls?.sections || []
  } else {
    sections.value = []
  }
})

const handleSubmit = async () => {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.firstName) { errors.firstName = 'Required' }
  if (!form.lastName) { errors.lastName = 'Required' }
  if (!form.email) { errors.email = 'Required' }
  if (!form.classId) { errors.classId = 'Required' }
  if (Object.keys(errors).length) return

  saving.value = true
  try {
    await api.post('/users/student', form)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Student created', life: 3000 })
    emit('saved')
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Failed to create student', life: 3000 })
  } finally {
    saving.value = false
  }
}

onMounted(loadClasses)
</script>
