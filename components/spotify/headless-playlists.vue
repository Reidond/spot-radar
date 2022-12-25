<script setup lang="ts">
const { data: session } = useSession();

const { pending, data: playlists } =
  useFetch<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
    "https://api.spotify.com/v1/me/playlists",
    {
      pick: ["items"],
      headers: { Authorization: `Bearer ${session.value!.accessToken}` },
    }
  );
</script>

<template>
  <div v-if="session">
    <div v-if="pending || !playlists">Loading...</div>
    <slot v-else :items="playlists.items" />
  </div>
</template>
