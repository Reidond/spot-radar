import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: DefaultSession["user"] & { id: string };
  }
  interface Profile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: Explicitcontent;
    external_urls: Externalurls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
  }
}

interface Image {
  height?: any;
  url: string;
  width?: any;
}

interface Followers {
  href?: any;
  total: number;
}

interface Externalurls {
  spotify: string;
}

interface Explicitcontent {
  filter_enabled: boolean;
  filter_locked: boolean;
}
