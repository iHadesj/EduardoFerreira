import { siteConfig } from "@/lib/site-config";
import { OG_CONTENT_TYPE, OG_SIZE, homeOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${siteConfig.name} — ${siteConfig.role.en}`;

export default function OpengraphImage() {
  return homeOgImage("en");
}
