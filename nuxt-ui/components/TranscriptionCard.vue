<template>
  <div class="card">
    <!-- Header -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="font-semibold text-gray-800 truncate">{{ transcription.fileName }}</h3>
        <p class="meta">{{ formatDate(transcription.createdAt) }}</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-600">You</p>
        <button
          @click="handleDelete"
          :disabled="isDeleting"
          class="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 mt-2"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>

    <!-- Text -->
    <div class="bg-gray-50 rounded p-3 mb-3">
      <p class="text-gray-700 text-sm">
        {{ showFullText ? transcription.text : textPreview }}
      </p>
      <button
        v-if="transcription.text.length > 200"
        @click="showFullText = !showFullText"
        class="text-indigo-600 text-sm font-medium mt-2 hover:underline"
      >
        {{ showFullText ? 'Show less' : 'Show more' }}
      </button>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between">
      <button
        @click="downloadText"
        class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Download Text
      </button>
      <span class="meta">{{ transcription.status }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  transcription: Object,
})

const emit = defineEmits(['delete'])

const showFullText = ref(false)
const isDeleting = ref(false)

const textPreview = computed(() => {
  const text = props.transcription?.text || ''
  return text.length > 200 ? text.substring(0, 200) + '...' : text
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const downloadText = () => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(props.transcription.text))
  element.setAttribute('download', `${props.transcription.fileName.split('.')[0]}.txt`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const handleDelete = async () => {
  if (window.confirm('Delete this transcription?')) {
    isDeleting.value = true
    emit('delete')
  }
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
.meta {
  color: #6b7280;
  font-size: 0.9rem;
}
</style>
