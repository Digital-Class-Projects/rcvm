"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Users, Diamond } from "lucide-react";
import { motion } from "framer-motion";

const servicesData = [
  {
    title: "Ceremony Planning",
    description: "Unlock the secrets to a flawless ceremony with our expert planning services. We handle every detail, so you can cherish every moment.",
    popupDescription: "Complete coordination for a flawless ceremony, including vendor management, timeline creation, and on-site support.",
    imageSrc: "https://ik.imagekit.io/rgazxzsxr/wedplan-thumb1.jpg?updatedAt=1762496401907",
    icon: <Users className="w-8 h-8 text-foreground" />,
  },
  {
    title: "Wedding Planning",
    description: "From 'yes' to 'I do,' our comprehensive wedding planning ensures your vision comes to life. Let us craft your perfect day.",
    popupDescription: "Full-service planning to bring your dream wedding to life. We handle everything, so you can enjoy every moment.",
    imageSrc: "https://ik.imagekit.io/rgazxzsxr/wedplan-thumb2.jpg?updatedAt=1762496402052",
    icon: <Heart className="w-10 h-10 text-primary" />,
    featured: true,
  },
  {
    title: "Reception Planning",
    description: "Create an unforgettable celebration with our reception planning. We focus on stunning decor, seamless flow, and a party to remember.",
    popupDescription: "Expert planning for a memorable reception, including decor, catering, entertainment, and guest management.",
    imageSrc: "https://ik.imagekit.io/rgazxzsxr/wedplan-thumb3.jpg?updatedAt=1762496402189",
    icon: <Diamond className="w-8 h-8 text-foreground" />,
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-background relative z-30 -mt-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-8 flex-wrap">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              className="group relative bg-white shadow-xl rounded-xl overflow-visible"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* CARD BODY */}
              <motion.div
                variants={{
                  rest: { y: 0 },
                  hover: { y: -16 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-80 h-[480px] flex flex-col rounded-xl overflow-hidden bg-white"
              >
                <div className="relative h-56">
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col items-center px-6 pt-12 pb-6">
                  <div className="absolute top-48 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl text-primary mt-8 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm text-center line-clamp-3 px-4">
                    {service.description}
                  </p>

                  <Button className="rounded-full bg-primary hover:bg-accent mt-6">
                    View
                  </Button>
                </div>
              </motion.div>

              {/* ENVELOPE POP-UP (HOVER) */}
              <motion.div
                className="absolute bottom-0 left-0 w-full origin-bottom"
                variants={{
                  rest: { height: 0, opacity: 0 },
                  hover: { height: 220, opacity: 1 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="relative w-full h-full bg-white rounded-b-xl shadow-2xl overflow-hidden">
                  {/* ENVELOPE FLAP (TRIANGLE) */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[160px] border-r-[160px] border-b-[60px] border-transparent"
                    style={{ borderBottomColor: "white" }}
                  />
                  <div
                    className="absolute top-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[158px] border-r-[158px] border-b-[58px] border-transparent"
                    style={{ borderBottomColor: "#fef7f4" }}
                  />

                  {/* CONTENT INSIDE LETTER */}
                  <div className="pt-16 px-6 pb-6 text-center">
                    <p className="font-semibold text-foreground text-sm">
                      On Behalf of Your Wedding
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      Explore our exclusive packages and let us craft the perfect celebration for your special day.
                    </p>
                    <a href="#" className="block text-xs text-primary hover:underline mt-3">
                      View Full Details →
                    </a>
                    <Button size="sm" className="rounded-full bg-primary hover:bg-accent mt-4">
                      Open Package
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
