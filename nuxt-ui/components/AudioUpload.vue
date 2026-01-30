<template>
  <div class="bg-white rounded-lg shadow-lg p-6 space-y-4">
    <h2 class="text-2xl font-bold text-gray-800">Upload Audio</h2>

    <!-- Drag & Drop Area -->
    <div
      @dragover.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition',
        dragover
          ? 'border-indigo-600 bg-indigo-50'
          : 'border-gray-300 hover:border-indigo-600'
      ]"
    >
      <p class="text-gray-600 mb-2">Drag & drop audio files here or</p>
      <label>
        <input
          type="file"
          accept="audio/*"
          @change="handleFileSelect"
          class="hidden"
        />
        <span class="text-indigo-600 font-medium cursor-pointer hover:underline">
          click to select
        </span>
      </label>
    </div>

    <!-- Selected File -->
    <div v-if="selectedFile" class="bg-gray-50 p-4 rounded-lg">
      <p class="text-sm text-gray-600 mb-2">Selected: {{ selectedFile.name }}</p>
      <button
        @click="handleUpload"
        :disabled="uploading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition"
      >
        {{ uploading ? 'Uploading...' : 'Upload & Transcribe' }}
      </button>
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

const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const error = ref('')
const dragover = ref(false)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    selectedFile.value = target.files[0]
  }
}

const handleDrop = (event: DragEvent) => {
  dragover.value = false
  if (event.dataTransfer?.files?.length) {
    selectedFile.value = event.dataTransfer.files[0]
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  try {
    uploading.value = true
    error.value = ''

    const formData = new FormData()
    formData.append('audio', selectedFile.value)

    const response = await api.post('/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    emit('success', response.data)
    selectedFile.value = null
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Upload failed'
  } finally {
    uploading.value = false
  }
}
</script>
