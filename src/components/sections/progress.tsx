"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";
import CountUp from "react-countup";

const progressData = [
  { value: 1500, label: "Project Done" },
  { value: 2500, label: "Happy Client" },
  { value: 3500, label: "Cup Of Coffee" },
  { value: 120, label: "Award Win" },
];

const testimonials = [
  {
    quote:
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound the actual teachings of the great.",
    name: "Aliza Anny",
    title: "CEO of The Rax",
    image: "https://ik.imagekit.io/rgazxzsxr/ceo1.jpg?updatedAt=1762498371773",
  },
  {
    quote:
      "A different quote explaining how this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound the actual teachings of the great.",
    name: "Jhon Doe",
    title: "Director of Themelock",
    image: "https://ik.imagekit.io/rgazxzsxr/ceo2.jpg?updatedAt=1762498371804",
  },
];

export default function Progress() {
  return (
    <section id="progress" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          <div className="relative aspect-[6/5] rounded-lg overflow-hidden shadow-xl lg:col-span-3">
            <Image
              src="https://ik.imagekit.io/rgazxzsxr/gallery-img5.jpg?updatedAt=1762498372253"
              alt="Wedding reception background"
              fill
              className="object-cover"
              data-ai-hint="wedding reception"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <Carousel
                className="w-full max-w-md"
                plugins={[Autoplay({ delay: 5000 })]}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-[#1e3a8a]/80 backdrop-blur-sm p-6 py-16 rounded-lg text-white text-center">
                        <Quote className="w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="italic mb-6 text-white/90">
                          {testimonial.quote}
                        </p>
                        <div className="flex items-center justify-center">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={60}
                            height={60}
                            className="rounded-full mr-4 border-2 border-primary"
                            data-ai-hint="person portrait"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                            <p className="text-sm text-primary">{testimonial.title}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-[-20px] text-white bg-white/20 hover:bg-primary border-none" />
                <CarouselNext className="right-[-20px] text-white bg-white/20 hover:bg-primary border-none" />
              </Carousel>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="text-left mb-12">
              <h2 className="font-serif text-5xl text-foreground">Our Progress</h2>
              <p className="text-muted-foreground mt-2">
                A glimpse into our journey of creating beautiful memories.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {progressData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform hover:-translate-y-2"
                >
                  <h3 className="text-4xl font-bold text-primary">
                    <CountUp end={item.value} duration={3} enableScrollSpy />+
                  </h3>
                  <p className="text-muted-foreground mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
