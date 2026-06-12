"use client";

import { useToast } from "@/components/ui/toast";
import { siteConfig } from "@/lib/site-config";

/** Giant clickable e-mail — copies to clipboard and toasts. */
export function CopyEmail() {
  const { toast } = useToast();
  return (
    <button
      type="button"
      data-cursor="hover"
      onClick={() => {
        void navigator.clipboard?.writeText(siteConfig.email);
        toast("E-mail copiado");
      }}
      className="link-underline font-display text-bone hover:text-molten w-fit text-left text-[length:clamp(1.5rem,5vw,3rem)] leading-tight transition-colors hover:bg-[length:100%_1px]"
    >
      {siteConfig.email}
    </button>
  );
}
