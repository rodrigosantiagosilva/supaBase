<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from '@/lib/supabaseClient'
  
  const todos = ref([])

  async function getTodos() {
    const { data } = await supabase.from('todos').select()
    todos.value = data
  }

  onMounted(() => {
    getTodos()
  })
</script>
