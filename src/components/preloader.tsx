"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type PreloaderProps = {
  loading: boolean;
};

export default function Preloader({ loading }: PreloaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500",
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="heart-pulse">
        <Heart className="h-24 w-24 text-primary" fill="currentColor" />
      </div>
    </div>
  );
}
