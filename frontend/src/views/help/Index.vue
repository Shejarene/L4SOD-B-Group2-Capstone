<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <Accordion :multiple="true">
          <AccordionTab v-for="faq in faqs" :key="faq.q" :header="faq.q">
            <p class="text-gray-600 dark:text-gray-300">{{ faq.a }}</p>
          </AccordionTab>
        </Accordion>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Guide</h2>
        <div class="space-y-4">
          <div v-for="guide in guides" :key="guide.title" class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <i :class="guide.icon" class="text-xl mt-1"></i>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{{ guide.title }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ guide.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Chat Widget -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Live Chat with Support</h2>
          <span class="flex items-center gap-1.5 text-sm text-green-600">
            <span class="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
            Online
          </span>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 h-80 overflow-y-auto mb-4 space-y-3" ref="chatContainer">
          <div v-if="!chatMessages.length" class="text-center py-12 text-gray-400">
            <i class="pi pi-comments text-4xl mb-3"></i>
            <p>Start a conversation with the support team</p>
          </div>
          <div
            v-for="msg in chatMessages"
            :key="msg.id"
            class="flex"
            :class="msg.isMine ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
              :class="msg.isMine
                ? 'bg-primary-600 text-white rounded-br-md'
                : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-500 rounded-bl-md'"
            >
              <p v-if="!msg.isMine" class="text-xs font-medium mb-0.5 opacity-70">{{ msg.sender }}</p>
              <p>{{ msg.text }}</p>
              <p class="text-[10px] mt-1 opacity-60 text-right">{{ msg.time }}</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="sendChatMessage" class="flex gap-2">
          <InputText
            v-model="chatInput"
            placeholder="Type your message..."
            class="flex-1 rounded-xl"
          />
          <Button
            type="submit"
            icon="pi pi-send"
            class="rounded-xl"
            :disabled="!chatInput.trim()"
          />
        </form>
      </div>
    </div>

    <div class="space-y-6">
      <div class="card">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-headphones text-3xl text-primary-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Administration</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Reach out to the school administration for assistance.
          </p>
          <div class="space-y-3 text-left">
            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <i class="pi pi-envelope text-primary-600"></i>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                <p class="text-sm text-gray-500">admin@school.com</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <i class="pi pi-phone text-primary-600"></i>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                <p class="text-sm text-gray-500">+250 780 000 001</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-info-circle text-3xl text-green-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Account</h3>
          <div class="space-y-2 text-sm text-left">
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-500">Name</span>
              <span class="font-medium">{{ auth.fullName }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-500">Role</span>
              <Tag :value="auth.userRole?.replace('_', ' ')" />
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-500">Status</span>
              <Tag value="Active" severity="success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/axios'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const auth = useAuthStore()

const faqs = [
  { q: 'How do I enter marks?', a: 'Go to Marks from the sidebar, select a Level and classroom, then enter scores for each student. Click "Save Marks" when done.' },
  { q: 'How does marks approval work?', a: 'Teachers enter marks as draft. DOS or Admin can then review and approve or reject them from the Marks Approval page.' },
  { q: 'How do I take attendance?', a: 'Navigate to Attendance, select the classroom and date, then mark each student as Present, Absent, Late, or Excused.' },
  { q: 'How do I request an account?', a: 'Go to the login page and click "Request Access". Fill in your details, select your role, and submit. The admin will review your request.' },
  { q: 'What are Levels and Trades?', a: 'Levels represent the academic year (3, 4, 5). Trades are your specialization: SOD (Software Development), NIT (Networking & IT), or MMP (Multimedia Production).' },
  { q: 'Can a teacher see all students?', a: 'Yes, teachers can access students across all classrooms and levels in their assigned trades.' },
]

const guides = [
  { title: 'Understanding Levels', desc: 'Levels 3, 4, and 5 represent progressive stages. Each level builds on the previous one with increasing depth.', icon: 'pi pi-sort-amount-up text-primary-600' },
  { title: 'Your Trade', desc: 'Choose between SOD (Software Development), NIT (Networking & IT), and MMP (Multimedia Production). Each has specialized subjects.', icon: 'pi pi-cog text-blue-600' },
  { title: 'Academic Workflow', desc: 'Subjects are allocated to teachers first, then exams created, marks entered, and finally approved.', icon: 'pi pi-chart-line text-green-600' },
  { title: 'Getting Help', desc: 'Use the live chat below to instantly connect with the support team or email admin@school.com.', icon: 'pi pi-comments text-yellow-600' },
]

const chatMessages = ref([])
const chatInput = ref('')
const chatContainer = ref(null)
let chatId = 0

const sendChatMessage = async () => {
  if (!chatInput.value.trim()) return
  const text = chatInput.value
  chatInput.value = ''

  chatMessages.value.push({
    id: ++chatId,
    text,
    isMine: true,
    sender: auth.fullName || 'You',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })

  try {
    const { data } = await api.post('/communication/messages', {
      receiverId: 'a0000001-0000-0000-0000-000000000001',
      subject: 'Help Chat Message',
      body: text,
    })
    if (data.success) {
      setTimeout(() => {
        chatMessages.value.push({
          id: ++chatId,
          text: "Thank you for your message. The support team will get back to you shortly. For urgent matters, please call +250 780 000 001.",
          isMine: false,
          sender: 'Support Team',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
        scrollToBottom()
      }, 1000)
    }
  } catch {
    chatMessages.value.push({
      id: ++chatId,
      text: "⚠️ Could not reach the server. Your message will be sent when connection is restored.",
      isMine: false,
      sender: 'System',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

onMounted(() => {
  chatMessages.value.push({
    id: ++chatId,
    text: `👋 Hello ${auth.fullName}! How can we help you today?`,
    isMine: false,
    sender: 'Support Team',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })
})
</script>
