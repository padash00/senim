"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  text?: string;
  className?: string;
};

/**
 * Native Share API where supported (mobile, modern desktop browsers),
 * graceful clipboard fallback elsewhere.
 */
export function ShareButton({ title, text, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = { title: title ?? document.title, text: text ?? "", url };
    try {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (typeof nav.share === "function") {
        await nav.share(data);
        return;
      }
    } catch {
      /* user cancelled — silent */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — silent */
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={onShare} className={cn(className)}>
      {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Скопировано" : "Поделиться"}
    </Button>
  );
}
