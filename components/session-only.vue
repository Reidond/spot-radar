<script setup lang="ts">
const { data: session } = useSession();
</script>

<template>
  <div v-if="session && session.accessToken">
    <slot />
  </div>
</template>
