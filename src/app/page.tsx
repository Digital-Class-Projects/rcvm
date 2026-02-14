"use client";

import Header from "@/components/header";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Comfort from "@/components/sections/comfort";
import Progress from "@/components/sections/progress";
import Team from "@/components/sections/people";
import Gallery from "@/components/sections/gallery";
import Rsvp from "@/components/sections/rsvp";
import Footer from "@/components/footer";
import ImportantPeople from "@/components/sections/important-people";
import Blog from "@/components/sections/blog";
import { FirebaseProvider } from "@/firebase/provider";

export default function Home() {
  return (
    <FirebaseProvider>
        <Header />
        <main>
          <Hero />
          <Services />
          <Pricing />
          <Comfort />
          <Progress />
          <ImportantPeople />
          <Team />
          <Blog />
          <Gallery />
          <Rsvp />
        </main>
        <Footer />
    </FirebaseProvider>
  );
}
