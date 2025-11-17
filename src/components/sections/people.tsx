"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { peopleContent } from "@/lib/content";
import { Facebook, Twitter, Instagram } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";

export default function Team() {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="font-serif text-5xl text-foreground">{peopleContent.title}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">The creative minds and dedicated hearts behind every successful event.</p>
        </div>

        <Carousel 
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
        >
            <CarouselContent>
            {peopleContent.team.map((person) => (
                <CarouselItem key={person.name} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                        <Card className="border-none shadow-lg overflow-hidden group text-center">
                            <CardContent className="p-0">
                                <div className="relative aspect-[4/5] w-full overflow-hidden">
                                    <Image
                                        src={person.imageSrc}
                                        alt={`Portrait of ${person.name}`}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="woman portrait"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-primary/70 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-4">
                                            <a href="#" className="text-white hover:text-accent-foreground"><Facebook /></a>
                                            <a href="#" className="text-white hover:text-accent-foreground"><Twitter /></a>
                                            <a href="#" className="text-white hover:text-accent-foreground"><Instagram /></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-white">
                                    <h3 className="font-serif text-2xl text-foreground">
                                    {person.name}
                                    </h3>
                                    <p className="text-sm text-primary font-medium">{person.role}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 " />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
}
