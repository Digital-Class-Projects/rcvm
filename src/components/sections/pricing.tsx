"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Heart, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

const pricingData = [
  {
    title: "Silver Plan",
    price: 1000,
    duration: "6 Months",
    icon: <Heart className="w-6 h-6" />,
    featuredIcon: <Heart className="w-8 h-8 text-primary-foreground" />,
    imageSrc: "https://ik.imagekit.io/rgazxzsxr/images%20(2).jpeg?updatedAt=1762495497748",
    description: [
      "View unlimited profiles",
      "Send 50 interests",
      "Basic chat access",
      "Standard customer support"
    ],
  },
  {
    title: "Gold Plan",
    price: 1500,
    duration: "1 Year",
    icon: <Gem className="w-6 h-6" />,
    featuredIcon: <Gem className="w-8 h-8 text-primary-foreground" />,
    imageSrc: "https://ik.imagekit.io/rgazxzsxr/images%20(1).jpeg?updatedAt=1762495498145",
    description: [
      "All Silver features",
      "Send unlimited interests",
      "Profile boost for visibility",
      "Priority customer support"
    ],
  },
];

const DecorativeIcon = () => (
    <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto my-4 text-gray-300">
        <path d="M11.9997 13.6667C11.1108 13.6667 10.2218 13.3155 9.58686 12.6806C8.95191 12.0457 8.59999 11.1567 8.66634 10.2493C8.68301 10.0113 8.79967 9.79934 8.98967 9.662C9.17967 9.52467 9.42967 9.466 9.67301 9.50134C10.243 9.58467 10.743 9.358 11.1597 8.94134C11.5763 8.52467 11.803 8.02467 11.8863 7.45467C11.9217 7.21134 11.863 6.96134 11.7257 6.77134C11.5883 6.58134 11.3763 6.46467 11.1383 6.448C10.231 6.38167 9.34199 6.02975 8.70704 5.3948C8.07209 4.75985 7.72017 3.87084 7.72017 2.96334C7.72017 2.05584 8.07209 1.16683 8.70704 0.531881C9.34199 -0.103067 10.231 -0.45501 11.1383 -0.388676C12.0457 0.31801 12.6806 0.952958 13.2403 1.34134C13.5628 1.55427 13.9161 1.72252 14.2883 1.84134C14.8317 2.018 15.4023 1.94134 15.8997 1.662C16.143 1.52467 16.393 1.58334 16.583 1.72067C16.773 1.858 16.8897 2.07 16.873 2.308C16.8097 3.228 16.4583 4.108 15.8483 4.748C15.2383 5.388 14.3843 5.748 13.503 5.84134C12.933 5.92467 12.433 6.15134 12.0163 6.568C11.5997 6.98467 11.373 7.48467 11.4563 8.05467C11.4917 8.298 11.433 8.548 11.2957 8.738C11.1583 8.928 10.9463 9.04467 10.7083 9.06134C9.80101 9.12767 8.91199 9.47958 8.27704 10.1145C7.64209 10.7495 7.29017 11.6385 7.29017 12.546C7.29017 13.4535 7.64209 14.3425 8.27704 15.0047C8.61899 15.3556 9.02031 15.6425 9.46101 15.8547C9.91234 16.068 10.4083 16.1667 10.9083 16.14C11.8157 15.4433 12.4506 14.8084 13.0103 14.42C13.3503 14.2043 13.7231 14.0326 14.113 13.914C14.6563 13.7373 15.227 13.814 15.7243 14.0933C15.9677 14.2307 16.2177 14.172 16.4077 14.0347C16.5977 13.8973 16.7143 13.6853 16.6977 13.4473C16.6343 12.5273 16.9857 11.6473 17.5957 11.0073C18.2057 10.3673 19.0597 10.0073 19.941 9.914C20.511 9.83067 21.011 9.604 21.4277 9.18734C21.8443 8.77067 22.071 8.27067 21.9877 7.70067C21.9523 7.45734 22.011 7.20734 22.1483 7.01734C22.2857 6.82734 22.4977 6.71067 22.7357 6.72734C23.643 6.79367 24.532 6.44175 25.167 5.8068C25.8019 5.17185 26.1538 4.28284 26.1538 3.37534C26.1538 2.46784 25.8019 1.57883 25.167 0.943881C24.532 0.308933 23.643 -0.0430101 22.7357 0.023324C21.8283 -0.673342 21.1934 -1.30829 20.6337 -1.69668C20.3112 -1.9096 19.9579 -2.07785 19.5857 -2.19668C19.0423 -2.37334 18.4717 -2.29668 17.9743 -2.01734C17.731 -1.88 17.481 -1.93868 17.291 -1.80134C17.101 -1.664 16.9843 -1.452 17.001 -1.214C17.0643 -0.29401 16.713 0.58599 16.103 1.22599C15.493 1.86599 14.639 2.22599 13.7577 2.13266C13.1877 2.04932 12.6877 1.82266 12.271 1.406C11.8543 0.989324 11.6277 0.489324 11.711  -0.080676C11.7463 -0.32399 11.6877 -0.57399 11.5503 -0.76399C11.413 -0.95399 11.201 -1.07068 10.963 -1.054C10.0557 -0.987676 9.16665 -1.33958 8.5317 -1.97453C7.89675 -2.60948 7.54483 -3.49849 7.54483 -4.40599C7.54483 -5.31349 7.89675 -6.2025 8.5317 -6.83745C9.16665 -7.4724 10.0557 -7.82432 10.963 -7.758C11.8703 -7.06132 12.5053 -6.42637 13.065 -6.03799C13.3875 -5.82507 13.7408 -5.65682 14.113 -5.53799C14.6563 -5.36132 15.227 -5.43799 15.7243 -5.71732C15.9677 -5.85465 16.2177 -5.79599 16.4077 -5.65865C16.5977 -5.52132 16.7143 -5.30932 16.6977 -5.07132C16.6343 -4.15132 16.9857 -3.27132 17.5957 -2.63132C18.2057 -1.99132 19.0597 -1.63132 19.941 -1.72465C20.511 -1.80799 21.011 -2.03465 21.4277 -2.45132C21.8443 -2.86799 22.071 -3.36799 21.9877 -3.93799C21.9523 -4.18132 22.011 -4.43132 22.1483 -4.62132C22.2857 -4.81132 22.4977 -4.92799 22.7357 -4.91132C23.643 -4.84499 24.532 -4.49307 25.167 -3.85812C25.8019 -3.22317 26.1538 -2.33416 26.1538 -1.42666C26.1538 -0.519158 25.8019 0.37015 25.167 1.0051C24.532 1.64005 23.643 1.99199 22.7357 1.92566C22.4923 1.90899 22.2803 2.02566 22.143 2.21566C21.9943 2.41699 22.0417 2.67132 22.183 2.87132C22.743 3.65132 22.9417 4.58465 22.7357 5.48132C22.5297 6.37799 21.9417 7.15132 21.1217 7.64132C20.2883 8.13132 19.2983 8.28465 18.3477 8.08132C17.397 7.87799 16.5637 7.33132 15.9937 6.56799C15.6839 6.16016 15.2755 5.83617 14.8083 5.62132C14.3411 5.40647 13.8299 5.30691 13.3163 5.32799C12.409 5.39432 11.52 5.74624 10.885 6.38119C10.2501 7.01614 9.90101 7.90515 9.89634 8.81266C9.89634 9.72015 10.2483 10.6092 10.8833 11.2441C11.5182 11.8791 12.4072 12.231 13.3147 12.1647C14.222 11.468 14.857 10.833 15.4163 10.4447C15.7388 10.2317 16.0921 10.0635 16.4643 9.94467C17.0077 9.76801 17.5783 9.84467 18.0757 10.124C18.319 10.2613 18.569 10.2027 18.759 10.0653C18.949 9.92801 19.0657 9.71601 19.049 9.47801C18.9857 8.55801 19.337 7.67801 19.947 7.03801C20.557 6.39801 21.411 6.03801 22.2923 6.13134C22.8623 6.21467 23.3623 6.44134 23.779 6.85801C24.1957 7.27467 24.4223 7.77467 24.339 8.34467C24.3037 8.58801 24.3623 8.83801 24.4997 9.02801C24.637 9.21801 24.849 9.33467 25.087 9.31801C25.9943 9.25167 26.8833 9.59234 27.5183 10.2273C28.1532 10.8622 28.5052 11.7512 28.5052 12.6587C28.5052 13.5662 28.1532 14.4552 27.5183 15.0902C26.8833 15.7251 25.9943 16.077 25.087 16.0107C24.1797 16.7073 23.5447 17.3423 22.985 17.7307C22.6625 17.9436 22.3092 18.1118 21.937 18.2307C21.3937 18.4073 20.823 18.3307 20.3257 18.0513C20.0823 17.914 19.8323 17.9727 19.6423 18.11C19.4523 18.2473 19.3357 18.4593 19.3523 18.6973C19.4157 19.6173 19.0643 20.4973 18.4543 21.1373C17.8443 21.7773 16.9903 22.1373 16.1083 22.044C15.5383 21.9607 15.0383 21.734 14.6217 21.3173C14.205 20.9007 13.9783 20.4007 14.0617 19.8307C14.097 19.5873 14.0383 19.3373 13.901 19.1473C13.7637 18.9573 13.5517 18.8407 13.3137 18.8573C12.4063 18.9237 11.5173 18.5718 10.8824 17.9368C10.2474 17.3019 9.89551 16.4129 9.89551 15.5053C9.89551 14.5978 10.2474 13.7088 10.8824 13.0739C11.2243 12.723 11.6256 12.4361 12.0663 12.2239C12.5177 12.0105 13.0137 11.9118 13.5137 11.9393C13.5137 11.9393 11.9997 13.6667 11.9997 13.6667Z" strokeWidth="0.5"/>
    </svg>
)

export default function Pricing() {
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl text-foreground">Our Perfect Pricing</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Choose the perfect package that fits your dream wedding. We offer transparent pricing with no hidden fees.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 justify-center items-end max-w-4xl mx-auto">
          {pricingData.map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg border shadow-md transition-all duration-300 ease-in-out hover:shadow-xl"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={cn(
                  "relative h-0 overflow-hidden transition-all duration-500 ease-in-out rounded-t-lg",
                  hoveredCard === index ? "h-48" : "h-0"
              )}>
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover"
                  data-ai-hint="wedding reception"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className={cn(
                    "absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center transition-all duration-300",
                    hoveredCard === index ? "opacity-100" : "opacity-0"
                )}>
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-4xl text-primary-foreground">
                        {item.featuredIcon}
                    </div>
                </div>
              </div>

              <div className={cn("p-8 text-center transition-all duration-500 ease-in-out", hoveredCard === index ? 'pt-12' : 'pt-8')}>
                 <p className="text-sm text-muted-foreground">Start from, ₹{item.price} / {item.duration}</p>
                <div className={cn("my-4 text-primary text-3xl flex justify-center transition-opacity duration-300", hoveredCard === index ? "opacity-0 h-0" : "opacity-100 h-auto")}>
                    {item.icon}
                </div>
                
                <div className={cn("relative", hoveredCard === index ? "-mt-8" : "mt-0")}>
                  <div
                    className={cn(
                      "inline-block text-white px-8 py-3 relative transition-colors duration-300",
                      hoveredCard === index ? "bg-foreground" : "bg-primary"
                    )}
                    style={{
                      clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)'
                    }}
                  >
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                  </div>
                </div>

                <DecorativeIcon />
                
                <div className="space-y-4 text-muted-foreground text-sm mb-6">
                    {item.description.map((line, i) => (
                        <p key={i} className="border-t border-gray-200 pt-4">{line}</p>
                    ))}
                </div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button asChild size="lg" className="w-full rounded-full bg-primary hover:bg-accent text-primary-foreground transition-transform">
                    <Link href="/register">Choose Plan</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
