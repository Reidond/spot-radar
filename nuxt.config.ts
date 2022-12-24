// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  runtimeConfig: {
    spotify: {
      clientId: process.env.NUXT_SPOTIFY_CLIENT_ID,
      clientSecret: process.env.NUXT_SPOTIFY_CLIENT_SECRET,
      authSecret: process.env.NUXT_AUTH_SECRET,
    },
    auth: {
      isOriginSet: !!process.env.NUXT_AUTH_ORIGIN,
      origin: process.env.NUXT_AUTH_ORIGIN,
      basePath: "/api/auth",
    },
  },
  builder: "webpack",
  modules: ["@sidebase/nuxt-auth"],
});
