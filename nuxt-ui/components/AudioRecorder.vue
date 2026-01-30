<template>
  <div class="bg-white rounded-lg shadow-lg p-6 space-y-4">
    <h2 class="text-2xl font-bold text-gray-800">Record Audio</h2>

    <!-- Record/Stop Buttons -->
    <div class="flex gap-3">
      <button
        v-if="!recording"
        @click="startRecording"
        class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        <span class="w-3 h-3 bg-white rounded-full"></span>
        Start Recording
      </button>
      <button
        v-else
        @click="stopRecording"
        class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        <span class="w-3 h-3 bg-white rounded-full animate-pulse"></span>
        Stop Recording
      </button>
    </div>

    <!-- Preview & Submit -->
    <div v-if="audioBlob" class="bg-gray-50 p-4 rounded-lg">
      <p class="text-sm text-gray-600 mb-2">Recording ready:</p>
      <audio
        :src="audioUrl"
        controls
        class="w-full mb-3"
      />
      <div class="flex gap-3">
        <button
          @click="handleUpload"
          :disabled="uploading"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition"
        >
          {{ uploading ? 'Uploading...' : 'Submit Recording' }}
        </button>
        <button
          @click="resetRecording"
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition"
        >
          Re-record
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { api } = useApi()
const emit = defineEmits(['success'])

const recording = ref(false)
const audioBlob = ref<Blob | null>(null)
const uploading = ref(false)
const error = ref('')
let mediaRecorder: MediaRecorder | null = null
let chunks: BlobPart[] = []

const audioUrl = computed(() => {
  return audioBlob.value ? URL.createObjectURL(audioBlob.value) : ''
})

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    chunks = []

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      audioBlob.value = new Blob(chunks, { type: 'audio/webm' })
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.start()
    recording.value = true
    error.value = ''
  } catch (err) {
    error.value = 'Microphone access denied'
  }
}

const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop()
    recording.value = false
  }
}

const resetRecording = () => {
  audioBlob.value = null
  error.value = ''
}

const handleUpload = async () => {
  if (!audioBlob.value) return

  try {
    uploading.value = true
    error.value = ''

    const formData = new FormData()
    formData.append('audio', audioBlob.value, 'recording.webm')

    const response = await api.post('/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    emit('success', response.data)
    resetRecording()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Upload failed'
  } finally {
    uploading.value = false
  }
}
</script>
