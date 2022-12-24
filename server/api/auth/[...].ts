import { NuxtAuthHandler } from "#auth";
import { useRuntimeConfig } from "#imports";
import SpotifyProvider from "next-auth/providers/spotify";

const config = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: config.spotify.authSecret,
  callbacks: {
    // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        // @ts-expect-error
        token.id = profile.id;
      }
      return token;
    },
    // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // @ts-expect-error
      session.accessToken = token.accessToken;
      // @ts-expect-error
      session.user.id = token.id;
      return session;
    },
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    SpotifyProvider.default({
      clientId: config.spotify.clientId,
      clientSecret: config.spotify.clientSecret,
    }),
  ],
});
