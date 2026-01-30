<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <AuthPage v-if="!auth.isAuthenticated" />
    <TranscribePage v-else />
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()

onMounted(() => {
  auth.initAuth()
})
</script>
