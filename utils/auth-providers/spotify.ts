import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface SpotifyImage {
  url: string;
}

export interface SpotifyProfile extends Record<string, any> {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
}

export function SpotifyProvider<P extends SpotifyProfile>(
  options: OAuthUserConfig<P>,
  scope?: string[]
): OAuthConfig<P> {
  scope ??= ["user-read-email", "user-read-private"];

  return {
    id: "spotify",
    name: "Spotify",
    type: "oauth",
    authorization: `https://accounts.spotify.com/authorize?scope=${scope.join(
      " "
    )}`,
    token: "https://accounts.spotify.com/api/token",
    userinfo: "https://api.spotify.com/v1/me",
    profile(profile: SpotifyProfile) {
      return {
        id: profile.id,
        name: profile.display_name,
        email: profile.email,
        image: profile.images?.[0]?.url,
      };
    },
    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/spotify.svg",
      logoDark:
        "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/spotify.svg",
      bg: "#fff",
      text: "#2ebd59",
      bgDark: "#fff",
      textDark: "#2ebd59",
    },
    options,
  };
}
