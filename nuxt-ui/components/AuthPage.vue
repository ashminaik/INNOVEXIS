<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white rounded-lg shadow-lg p-8 w-96">
      <h1 class="text-3xl font-bold text-indigo-600 mb-6 text-center">SpeechToText</h1>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          @click="isLogin = true"
          :class="[
            'flex-1 py-2 rounded font-medium transition',
            isLogin
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          ]"
        >
          Login
        </button>
        <button
          @click="isLogin = false"
          :class="[
            'flex-1 py-2 rounded font-medium transition',
            !isLogin
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          ]"
        >
          Register
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition"
        >
          {{ loading ? 'Processing...' : isLogin ? 'Login' : 'Register' }}
        </button>
      </form>

      <!-- Error -->
      <div v-if="error" class="mt-4 bg-red-100 text-red-700 p-3 rounded">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  const result = isLogin.value
    ? await auth.login(email.value, password.value)
    : await auth.register(email.value, password.value)

  if (!result.success) {
    error.value = result.error
  } else {
    email.value = ''
    password.value = ''
  }

  loading.value = false
}
</script>
