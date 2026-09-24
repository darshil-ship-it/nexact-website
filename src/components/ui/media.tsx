import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { MediaAsset } from "@/types/content";
export function Media({ asset, priority = false, sizes = "(max-width: 767px) 100vw, 50vw" }: { asset: MediaAsset; priority?: boolean; sizes?: string }) {
  if (!asset.src) return <div className="media-placeholder" role="img" aria-label={`Media placeholder: ${asset.placeholder}`}><ImageIcon size={24} aria-hidden="true" /><span>{asset.placeholder}</span></div>;
  return <div className="media-frame">{asset.type === "video" ? <video src={asset.src} poster={asset.poster || undefined} muted playsInline controls preload="none" /> : <Image src={asset.src} alt={asset.alt} fill sizes={sizes} priority={priority} />}</div>;
}
