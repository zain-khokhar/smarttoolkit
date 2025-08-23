"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function NavBar() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo + Home */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl">SmartToolkit</span>
          </Link>
          <Link
            href="/"
            className="hidden md:block text-sm font-medium hover:underline"
          >
            Home
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Image Converter */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Image Converter</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-2 w-[300px] gap-2 p-2">
                    <li><NavigationMenuLink asChild><Link href="/png-to-png">PNG Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/webp-to-webp">WebP Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/jpeg-to-jpeg">JPEG Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/tif-to-png">JPG Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/gif-to-png">GIF Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/avif-to-png">AVIF Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/ico-to-png">ICO Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/svg-to-png">SVG Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/tiff-to-png">TIFF/TIF Converter</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/bmp-to-png">BMP Converter</Link></NavigationMenuLink></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Image Compressor */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Image Compressor</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-2">
                    <li><NavigationMenuLink asChild><Link href="/tools/jpeg">JPEG Compressor</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/tools/jpg">JPG Compressor</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/tools/webp">WebP Compressor</Link></NavigationMenuLink></li>
                    <li><NavigationMenuLink asChild><Link href="/tools/png">PNG Compressor</Link></NavigationMenuLink></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px]">
              {/* Accessible but hidden for UI */}
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Access all tools and navigation options
                </SheetDescription>
              </VisuallyHidden>

              <nav className="mt-4 space-y-4 px-4">
                <Link
                  href="/"
                  className="block text-lg font-medium"
                  onClick={handleClose}
                >
                  Home
                </Link>

                <Accordion type="single" collapsible>
                  {/* Image Converter */}
                  <AccordionItem value="converter">
                    <AccordionTrigger>Image Converter</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-2">
                        <li><Link href="/png-to-png" onClick={handleClose}>PNG Converter</Link></li>
                        <li><Link href="/webp-to-webp" onClick={handleClose}>WebP Converter</Link></li>
                        <li><Link href="/jpeg-to-jpeg" onClick={handleClose}>JPEG Converter</Link></li>
                        <li><Link href="/tif-to-png" onClick={handleClose}>JPG Converter</Link></li>
                        <li><Link href="/gif-to-png" onClick={handleClose}>GIF Converter</Link></li>
                        <li><Link href="/avif-to-png" onClick={handleClose}>AVIF Converter</Link></li>
                        <li><Link href="/ico-to-png" onClick={handleClose}>ICO Converter</Link></li>
                        <li><Link href="/svg-to-png" onClick={handleClose}>SVG Converter</Link></li>
                        <li><Link href="/tiff-to-png" onClick={handleClose}>TIFF/TIF Converter</Link></li>
                        <li><Link href="/bmp-to-png" onClick={handleClose}>BMP Converter</Link></li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Image Compressor */}
                  <AccordionItem value="compressor">
                    <AccordionTrigger>Image Compressor</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-2">
                        <li><Link href="/tools/jpeg" onClick={handleClose}>JPEG Compressor</Link></li>
                        <li><Link href="/tools/jpg" onClick={handleClose}>JPG Compressor</Link></li>
                        <li><Link href="/tools/webp" onClick={handleClose}>WebP Compressor</Link></li>
                        <li><Link href="/tools/png" onClick={handleClose}>PNG Compressor</Link></li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
