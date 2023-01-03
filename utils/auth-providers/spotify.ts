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

type SpotifyProviderParams<P extends SpotifyProfile> = {
  options: OAuthUserConfig<P>;
  scope?: string[];
};

export function SpotifyProvider<P extends SpotifyProfile>(
  params: SpotifyProviderParams<P>
): OAuthConfig<P> {
  params.scope ??= ["user-read-email", "user-read-private"];
  const scopeStr = params.scope.join(" ");

  return {
    id: "spotify",
    name: "Spotify",
    type: "oauth",
    authorization: `https://accounts.spotify.com/authorize?scope=${scopeStr}`,
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
    options: params.options,
  };
}
