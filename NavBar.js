"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./src/components/ui/navigation-menu"

export function NavBar() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-baseline gap-4 px-4 py-3">
        {/* Logo + Home */}
        <div className="flex items-center gap-3 ">
          <Link href="/" className="flex items-center gap-2">
            {/* <Image
              src="/logo.webp" // change this to your logo path
              alt="Logo"
              width={32}
              height={32}
            /> */}
            <span className="font-bold text-3xl">SmartToolkit</span>
          </Link>
          <Link href="/" className="ml-4 text-sm font-medium hover:underline">
            Home
          </Link>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu viewport={false}>
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
    </div>
  )
}
