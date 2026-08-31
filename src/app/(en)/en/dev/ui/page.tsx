import type { Metadata } from "next";
import { DevUiPage } from "@/components/pages/dev-ui";

export const metadata: Metadata = {
  title: "Design system — /dev/ui",
  robots: { index: false, follow: false },
};

export default function DevUi() {
  return <DevUiPage locale="en" />;
}
