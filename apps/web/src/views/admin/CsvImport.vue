<template>
  <div>
    <h1 class="page-title">Bulk Student Import</h1>

    <div class="card mb-6">
      <h3 class="text-lg font-semibold mb-2">Instructions</h3>
      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <li>Prepare a CSV file with the required columns</li>
        <li>Required: <strong>firstName</strong>, <strong>lastName</strong></li>
        <li>Optional: email, phone, class, section, gender, dateOfBirth, address, admissionNumber, password</li>
        <li>Class and section values must match existing records in the system</li>
        <li>Download a <a @click="downloadTemplate" class="text-primary-600 cursor-pointer hover:underline">sample template</a></li>
      </ul>
    </div>

    <div class="card mb-6">
      <div class="flex items-center gap-4">
        <input
          ref="fileInput"
          type="file"
          accept=".csv,.xlsx,.xls"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          @change="handleFile"
        />
        <Button label="Import" icon="pi pi-upload" @click="importData" :disabled="!parsedData.length || importing" :loading="importing" />
      </div>
    </div>

    <div v-if="parsedData.length" class="card mb-6">
      <h3 class="text-lg font-semibold mb-3">Preview ({{ parsedData.length }} rows)</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700">
              <th v-for="col in columns" :key="col" class="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300 capitalize">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in parsedData.slice(0, 10)" :key="i" class="border-t border-gray-200 dark:border-gray-600">
              <td v-for="col in columns" :key="col" class="px-3 py-2">{{ row[col] || '-' }}</td>
            </tr>
            <tr v-if="parsedData.length > 10" class="border-t border-gray-200 dark:border-gray-600">
              <td :colspan="columns.length" class="px-3 py-2 text-center text-gray-400">... and {{ parsedData.length - 10 }} more rows</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="importResult" class="card">
      <h3 class="text-lg font-semibold mb-3">Import Results</h3>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p class="text-2xl font-bold text-green-600">{{ importResult.created.length }}</p>
          <p class="text-sm text-green-600">Created</p>
        </div>
        <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <p class="text-2xl font-bold text-red-600">{{ importResult.errors.length }}</p>
          <p class="text-sm text-red-600">Errors</p>
        </div>
      </div>

      <div v-if="importResult.errors.length" class="mt-4">
        <h4 class="font-medium mb-2 text-red-600">Errors</h4>
        <div v-for="(err, i) in importResult.errors" :key="i" class="text-sm text-red-500 mb-1">
          Row {{ err.row }}: {{ err.error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../utils/api'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const fileInput = ref(null)
const parsedData = ref([])
const columns = ref([])
const importing = ref(false)
const importResult = ref(null)

const handleFile = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target.result
    const lines = text.split('\n').map(l => l.trim()).filter(l => l)
    if (lines.length < 2) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'CSV must have a header row and data rows', life: 3000 })
      return
    }

    const headers = lines[0].split(',').map(h => h.trim())
    columns.value = headers

    const rows = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row = {}
      headers.forEach((h, idx) => { row[h] = values[idx] || '' })
      rows.push(row)
    }
    parsedData.value = rows
    toast.add({ severity: 'info', summary: 'Parsed', detail: `${rows.length} rows found`, life: 3000 })
  }
  reader.readAsText(file)
}

const importData = async () => {
  if (!parsedData.value.length) return
  importing.value = true
  importResult.value = null
  try {
    const { data } = await api.post('/import/students', { entries: parsedData.value })
    if (data.success) {
      importResult.value = data.data
      toast.add({ severity: 'success', summary: 'Import Complete', detail: `${data.data.created.length} students created`, life: 5000 })
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Import failed', life: 5000 })
  } finally { importing.value = false }
}

const downloadTemplate = () => {
  const csv = 'firstName,lastName,email,phone,class,section,gender,dateOfBirth,address,admissionNumber,password\nJohn,Doe,john@example.com,0788000000,Senior 1,A,male,2010-01-15,123 Main St,2025/001/001,password123'
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'student_import_template.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>
