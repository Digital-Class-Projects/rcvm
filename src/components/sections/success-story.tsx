import Image from "next/image";
import { Button } from "../ui/button";
import { Play } from "lucide-react";

export default function SuccessStory() {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square">
              <Image
                src="https://picsum.photos/seed/success/600/600"
                alt="Bride and Groom wooden hearts"
                fill
                className="object-cover rounded-lg"
                data-ai-hint="bride groom"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="icon" className="w-20 h-20 rounded-full bg-white text-primary hover:bg-primary/90 hover:text-white transition-colors duration-300 shadow-lg">
                    <Play className="w-8 h-8 fill-current" />
                </Button>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-4xl text-primary mb-2">Our Success Story</h2>
              <h3 className="text-xl font-semibold text-foreground mb-4">We start our first 15th June 2007</h3>
              <p className="text-muted-foreground mb-8">
                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth.
              </p>
              <Button className="rounded-full bg-primary hover:bg-accent">
                View More
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
