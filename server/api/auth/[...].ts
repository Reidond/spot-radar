import { SpotifyProvider } from "~/utils/auth-providers/spotify";
import { NuxtAuthHandler } from "#auth";
import { useRuntimeConfig } from "#imports";
import { JWT } from "next-auth/jwt";
import {
  registerUser,
  isUserRegistered,
} from "~~/utils/supabase/register-user";

const config = useRuntimeConfig();

type RefreshedJWT = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(refreshToken: JWT) {
  try {
    const authHeader = Buffer.from(
      `${config.spotify.clientId}:${config.spotify.clientSecret}`,
      "utf-8"
    ).toString("base64");
    const refreshedTokens = await $fetch<RefreshedJWT | { error: null }>(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          refresh_token: refreshToken.refreshToken as string,
          grant_type: "refresh_token",
          client_id: config.spotify.clientId,
        }),
      }
    );

    if (Object.hasOwn(refreshedTokens, "error")) {
      console.warn("No refreshed tokens");
      throw refreshedTokens;
    }

    return {
      ...refreshToken,
      accessToken: (refreshedTokens as RefreshedJWT).access_token,
      expiresIn: Date.now() + (refreshedTokens as RefreshedJWT).expires_in,
    };
  } catch (error) {
    console.error("Error refreshing token", error);
    return {
      ...refreshToken,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NuxtAuthHandler({
  secret: config.spotify.authSecret,
  callbacks: {
    // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = profile.id;

        // try to register user here
        const weHaveUser = await isUserRegistered(profile.id);
        if (!weHaveUser) {
          await registerUser(profile.id);
        }
      }

      if (token.expiresIn && Date.now() > token.expiresIn) {
        console.warn("Token is expired. Getting a new");
        return refreshAccessToken(token);
      }

      return token;
    },
    // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user.id = token.id as string;

      // try to refresh user in db
      // TODO: also prob need to update if id different
      const weHaveUser = await isUserRegistered(session.user.id);
      if (!weHaveUser) {
        await registerUser(session.user.id);
      }

      return session;
    },
  },
  providers: [
    SpotifyProvider(
      {
        clientId: config.spotify.clientId,
        clientSecret: config.spotify.clientSecret,
      },
      ["user-read-email", "user-read-private", "playlist-read-private"]
    ),
  ],
});
