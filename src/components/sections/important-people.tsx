'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { importantPeopleContent } from '@/lib/content';
import { cn } from '@/lib/utils';
import React from 'react';

export default function ImportantPeople() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="py-24 bg-background overflow-hidden important-people-section">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-primary px-6 py-2 rounded-full">
            <h2 className="font-serif text-4xl text-primary-foreground">
              {importantPeopleContent.title}
            </h2>
          </div>
        </div>
      </div>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: 'center',
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2">
          {importantPeopleContent.people.map((person, index) => (
            <CarouselItem
              key={index}
              className={cn('pl-2 basis-full md:basis-1/2 lg:basis-1/3')}
            >
              <div className="text-center carousel-item-container p-1">
                <div className="bg-white p-[3px] rounded-lg shadow-xl max-w-sm mx-auto">
                  <div className="relative aspect-[4/4.5] overflow-hidden rounded-md group">
                    <Image
                      src={person.imageSrc}
                      alt={person.name}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                      data-ai-hint="person portrait"
                    />
                    <div className="absolute inset-0 flex items-end transition-opacity duration-300">
                      <div className="info-box bg-primary/80 text-primary-foreground p-3 text-center w-full">
                        <h3 className="font-serif text-2xl">{person.name}</h3>
                        <p className="text-sm">({person.role})</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 " />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </section>
  );
}
