<script setup lang="ts">
const { status, data, signIn, signOut } = useSession();

const onClick = () => {
  if (status.value === "authenticated") {
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
  } else {
    signIn("spotify");
  }
};

const buttonText = computed(() =>
  status.value === "authenticated" ? "log out to spotify" : "log in to spotify"
);
</script>

<template>
  <div>
    <h1>Hello</h1>
    <p>{{ data || "please login" }}</p>
    <button @click="onClick">{{ buttonText }}</button>
  </div>
</template>
