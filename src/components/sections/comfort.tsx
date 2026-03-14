"use client";

import Image from "next/image";
import { Flower, Camera, Utensils, CakeSlice, Mail, Plane } from "lucide-react";
import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const comfortServices = [
  { title: "Flower", subtitle: "Design", icon: <Flower /> },
  { title: "Photo", subtitle: "Booth", icon: <Camera /> },
  { title: "Best", subtitle: "Restaurant", icon: <Utensils /> },
  { title: "Wedding", subtitle: "Cake", icon: <CakeSlice /> },
  { title: "Invitation", subtitle: "Card", icon: <Mail /> },
  { title: "Honey", subtitle: "moon", icon: <Plane /> },
];

export default function Comfort() {
  return (
    <section className="bg-background py-24 romantic-gradient-shift">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 bg-white p-4 rounded-2xl shadow-lg backdrop-blur-sm">
          {/* Left Side */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl flex items-center justify-center">
            <Image
              src="https://ik.imagekit.io/rgazxzsxr/wethingabout-2.jpg?updatedAt=1762496782629"
              alt="Bride in pink dress holding flowers"
              fill
              className="object-cover"
              data-ai-hint="bride flowers"
            />
            <div className="relative p-8 bg-[#1e3a8a]/70 rounded-lg">
              <h2 className="font-serif text-5xl text-white max-w-xs text-center leading-snug">
                We think about <span className="text-[#f472b6]">your</span> comfort!
              </h2>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative min-h-[400px] rounded-lg overflow-hidden p-8">
             <div className="absolute inset-0">
                <Image
                    src="https://ik.imagekit.io/rgazxzsxr/wethingabout-1.jpg?updatedAt=1762496782626"
                    alt="Soft blurred floral background"
                    fill
                    className="object-cover blur-sm scale-110"
                    data-ai-hint="wedding decoration"
                />
                <div className="absolute inset-0 bg-white/80"></div>
             </div>
             <div className="relative">
                <Carousel
                    plugins={[
                        Autoplay({
                          delay: 3000,
                        }),
                      ]}
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                >
                    <CarouselContent>
                        <CarouselItem>
                            <div className="grid grid-cols-3 gap-8">
                                {comfortServices.slice(0, 6).map((service, index) => (
                                    <div key={index} className="group text-center flex flex-col items-center">
                                        <div className="relative w-24 h-24 rounded-full bg-[#f472b6] flex items-center justify-center text-white text-4xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-[#f472b6]/50">
                                            <div className="absolute inset-0 rounded-full border-2 border-white/50 transform scale-90 group-hover:scale-100 transition-transform duration-300"></div>
                                            {service.icon}
                                        </div>
                                        <h3 className="font-serif text-lg mt-4">
                                            <span className="text-[#f472b6]">{service.title}</span> <span className="text-muted-foreground">{service.subtitle}</span>
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                             <div className="grid grid-cols-3 gap-8">
                                {comfortServices.slice(0, 6).map((service, index) => (
                                    <div key={index} className="group text-center flex flex-col items-center">
                                        <div className="relative w-24 h-24 rounded-full bg-[#f472b6] flex items-center justify-center text-white text-4xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-[#f472b6]/50">
                                            <div className="absolute inset-0 rounded-full border-2 border-white/50 transform scale-90 group-hover:scale-100 transition-transform duration-300"></div>
                                            {service.icon}
                                        </div>
                                        <h3 className="font-serif text-lg mt-4">
                                            <span className="text-[#f472b6]">{service.title}</span> <span className="text-muted-foreground">{service.subtitle}</span>
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
                <div className="flex justify-center mt-8 space-x-2">
                    <div className="w-2.5 h-2.5 bg-[#f472b6] rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
