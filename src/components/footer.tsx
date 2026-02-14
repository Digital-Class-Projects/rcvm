import React from "react";
import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/content";
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navLinksLeft = navLinks.slice(0, 4);
  const navLinksRight = navLinks.slice(4);

  return (
    <footer id="contact" className="bg-primary py-16 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        
        <nav className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mb-8">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                    {link.label}
                </Link>
            ))}
        </nav>

        <div className="flex justify-center mb-8">
             <Link href="/" className="flex items-center justify-center">
                <Image src="https://ik.imagekit.io/rgazxzsxr/WhatsApp_Image_2025-11-17_at_14.09.46_86744fba-removebg-preview.png" alt="Ravidas Charmakar Logo" width={150} height={40} className="object-contain" />
            </Link>
        </div>
       
        <div className="flex justify-center items-center gap-4 mb-8">
            <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
        </div>
       
        <div className="border-t border-white/10 pt-8 mt-8">
            <p className="text-sm text-primary-foreground/80">
                &copy; {currentYear} {siteConfig.name}. All Rights Reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
