"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ArrowLeft } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { navLinkClass } from "@/lib/classnames";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const leftNav = [
    { name: "Properties", href: "/properties" },
    { name: "Services", href: "/services" },
  ];

  const rightNav = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container relative h-16 flex items-center justify-between">
        {/* Left nav (desktop) + burger (mobile) */}
        <div className="flex items-center">
          <button
            className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden md:flex space-x-8">
            {leftNav.map((item) => (
              <Link key={item.name} href={item.href} className={navLinkClass}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/"
            className="text-xl font-mono uppercase text-gray-900 tracking-wide"
          >
            Mont Cervin
          </Link>
        </div>

        {/* Right nav (desktop) + search */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6">
            {rightNav.map((item) => (
              <Link key={item.name} href={item.href} className={navLinkClass}>
                {item.name}
              </Link>
            ))}
          </nav>

          <button className="p-2 text-gray-700 hover:text-gray-900">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close and search at top */}
        <div className="flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-gray-800 hover:text-black"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile links */}
        <nav className="flex flex-col space-y-6 px-6 py-8">
          {/* Left nav */}
          {leftNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-black uppercase hover:text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Spacer */}
          <div className="h-6" />

          {/* Right nav */}
          {rightNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-medium text-gray-600 uppercase hover:text-gray-800 tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Social icons at bottom right */}
        <div className="absolute bottom-6 right-6 flex space-x-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="h-6 w-6 text-black hover:text-gray-600" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="h-6 w-6 text-black hover:text-gray-600" />
          </a>
        </div>
      </div>
    </header>
  );
}
