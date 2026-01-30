<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <!-- Header -->
    <header class="max-w-6xl mx-auto mb-8">
      <div class="flex justify-between items-center">
        <h1 class="text-4xl font-bold text-indigo-600">SpeechToText</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-700">Welcome, {{ auth.user?.email }}</span>
          <button
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Upload & Record Section -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Tab Navigation -->
          <div class="flex gap-2 bg-white rounded-lg p-1 shadow">
            <button
              @click="activeTab = 'upload'"
              :class="[
                'flex-1 py-2 px-4 rounded font-medium transition',
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              Upload
            </button>
            <button
              @click="activeTab = 'record'"
              :class="[
                'flex-1 py-2 px-4 rounded font-medium transition',
                activeTab === 'record'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              Record
            </button>
          </div>

          <!-- Content -->
          <AudioUpload v-if="activeTab === 'upload'" @success="handleTranscriptionAdded" />
          <AudioRecorder v-else @success="handleTranscriptionAdded" />
        </div>

        <!-- Transcriptions History -->
        <div class="lg:col-span-2">
          <div class="">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Transcription History</h2>
              <button
                @click="fetchTranscriptions"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Refresh
              </button>
            </div>

            <div v-if="loading && transcriptions.length === 0" class="card text-center p-8">
              <p class="text-gray-600">Loading transcriptions...</p>
            </div>

            <div v-else-if="transcriptions.length === 0" class="text-center py-8 card">
              <p class="text-gray-500">No transcriptions yet. Start by uploading or recording audio.</p>
            </div>

            <div v-else class="grid gap-4 grid-cols-1 md:grid-cols-2">
              <TranscriptionCard
                v-for="transcription in transcriptions"
                :key="transcription._id"
                :transcription="transcription"
                @delete="deleteTranscription(transcription._id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
const { api } = useApi()

const activeTab = ref('upload')
const transcriptions = ref([])
const loading = ref(false)

onMounted(() => {
  fetchTranscriptions()
})

const fetchTranscriptions = async () => {
  try {
    loading.value = true
    const response = await api.get('/transcribe')
    transcriptions.value = response.data
  } catch (error) {
    console.error('Failed to fetch transcriptions:', error)
  } finally {
    loading.value = false
  }
}

const handleTranscriptionAdded = (newTranscription: any) => {
  transcriptions.value.unshift(newTranscription)
}

const deleteTranscription = async (id: string) => {
  try {
    await api.delete(`/transcribe/${id}`)
    transcriptions.value = transcriptions.value.filter(t => t._id !== id)
  } catch (error) {
    console.error('Failed to delete transcription:', error)
  }
}

const handleLogout = () => {
  auth.logout()
}
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(15,23,42,0.04);
  padding: 1rem;
  border: 1px solid transparent;
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(15,23,42,0.08);
}
</style>
