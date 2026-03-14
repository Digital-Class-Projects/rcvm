"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Hero() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

  return (
    <section id="home" className="relative h-[800px] w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://ik.imagekit.io/rgazxzsxr/slider2%20(1).jpg"
          alt="Elegant wedding setup background"
          fill
          className="object-cover object-center zoom-in-out"
          priority
          data-ai-hint="white flowers"
        />
        <div className="absolute inset-0 bg-background/30"></div>
      </div>
      
      <div className="container mx-auto px-4 h-full relative">
        <div className="relative z-10 flex h-full items-center justify-start text-left">
            <div
                className={cn(
                    "opacity-0",
                    isLoaded && "fade-in"
                )}
            >
                <p className="font-serif text-2xl text-primary">
                    Welcome To Our,
                </p>
                <h1 className="font-serif text-8xl font-bold leading-tight tracking-tight text-foreground">
                    Wedding<br/>Planner!
                </h1>
                <div className="flex justify-start mt-4">
                    <span className="w-3 h-3 bg-primary rounded-full mx-1"></span>
                    <span className="w-3 h-3 bg-foreground/50 rounded-full mx-1"></span>
                    <span className="w-3 h-3 bg-foreground/50 rounded-full mx-1"></span>
                </div>
            </div>
        </div>
      </div>

      <div className={cn(
          "absolute bottom-0 right-0 w-[700px] h-[680px] z-20 pointer-events-none opacity-0",
          isLoaded && "fade-in"
        )}
      >
        <Image
            src="https://ik.imagekit.io/rgazxzsxr/slide-girl.png"
            alt="Bride"
            fill
            className="object-contain object-bottom"
            data-ai-hint="bride portrait"
        />
      </div>
       <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent z-30" />
    </section>
  );
}
