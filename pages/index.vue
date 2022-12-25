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
  status.value === "authenticated"
    ? "log out from spotify"
    : "log in to spotify"
);

const helloText = computed(() =>
  status.value === "authenticated" && data.value?.user
    ? `Hello, ${data.value?.user.name}`
    : "Hello, please login"
);
</script>

<template>
  <div>
    <h1>{{ helloText }}</h1>
    <button @click="onClick">{{ buttonText }}</button>
    <SessionOnly>
      <SpotifyHeadlessPlaylists v-slot="{ items }">
        <ul>
          <li v-for="{ id, name, external_urls } in items" :key="id">
            <a :href="external_urls.spotify">
              {{ name }}
            </a>
          </li>
        </ul>
      </SpotifyHeadlessPlaylists>
    </SessionOnly>
  </div>
</template>
