"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Heart, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/lib/content";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navLinksLeft = navLinks.slice(0, 4);
  const navLinksRight = navLinks.slice(4);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md"
      )}
    >
      <div className={cn("bg-primary")}>
        <div className="container mx-auto px-4 flex justify-between items-center h-10">
          <p className="text-sm text-primary-foreground">For any help contact at +88-017-5301-6694</p>
          <div className="flex items-center gap-2">
            <a href="#" className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-primary hover:bg-accent-foreground hover:text-white transition-colors"><Facebook className="w-3 h-3" /></a>
            <a href="#" className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-primary hover:bg-accent-foreground hover:text-white transition-colors"><Twitter className="w-3 h-3" /></a>
            <a href="#" className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-primary hover:bg-accent-foreground hover:text-white transition-colors"><Instagram className="w-3 h-3" /></a>
          </div>
        </div>
      </div>
      
      <div className={cn("transition-colors bg-white")}>
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
             <div className="flex items-center gap-2">
               <Link href="/" className="flex items-center gap-2">
                  <Image src="https://ik.imagekit.io/rgazxzsxr/WhatsApp_Image_2025-11-17_at_14.09.46_86744fba-removebg-preview.png" alt="Ravidas Charmakar Logo" width={100} height={20} className="object-contain" /> 
               </Link>
             </div>

            {/* Mobile Nav Trigger */}
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/10 hover:text-primary">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-white p-0">
                  <SheetHeader className="p-6">
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    <Link href="/" onClick={() => setOpen(false)}>
                      <Image src="https://ik.imagekit.io/rgazxzsxr/WhatsApp_Image_2025-11-17_at_14.09.46_86744fba-removebg-preview.png" alt="Ravidas Charmakar Logo" width={150} height={40} className="object-contain" />
                    </Link>
                  </SheetHeader>
                  <nav className="flex flex-col">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="px-6 py-3 text-lg font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                     <div className="border-t mt-4 pt-4 px-6 space-y-3">
                        <Button asChild className="w-full">
                          <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
                        </Button>
                      </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 gap-6">
              <div className="flex items-center gap-6">
                {navLinksLeft.map((link) => (
                  <NavButton key={link.href} link={link} isScrolled={isScrolled} />
                ))}
                {navLinksRight.map((link) => (
                  <NavButton key={link.href} link={link} isScrolled={isScrolled} />
                ))}
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-2 ml-6">
                <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/register">Register</Link>
                </Button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}


const NavButton = ({ link, isScrolled }: { link: any, isScrolled: boolean }) => {
  if (link.sublinks) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="font-medium transition-colors text-foreground/80 hover:text-primary">
            {link.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {link.sublinks.map((sublink: any) => (
            <DropdownMenuItem key={sublink.href} asChild>
              <Link href={sublink.href}>{sublink.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button variant="ghost" asChild>
      <Link href={link.href} className={cn("font-medium transition-colors text-foreground/80 hover:text-primary")}>
        {link.label}
      </Link>
    </Button>
  );
}
