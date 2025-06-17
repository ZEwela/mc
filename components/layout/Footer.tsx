"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { z } from "zod";

const emailSchema = z.string().email();

export function Footer() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const currentYear = new Date().getFullYear();

  const isEmailValid = (email: string) => emailSchema.safeParse(email).success;

  const isFormValid = isEmailValid(email) && accepted;

  const onSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      setIsSuccess(result.success);
      setMessage(result.message || result.error || "Something happened");

      if (result.success) {
        setEmail("");
        setAccepted(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      setIsSuccess(false);
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div className="order-1 lg:col-span-1">
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="order-2 lg:col-span-1">
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>+44 20 1234 5678</li>
              <li>sales@montcervin.co.uk</li>
              <li>London, UK</li>
            </ul>
          </div>

          {/* Newsletter - spans 2 columns on md+ */}
          <div className="order-3 lg:col-span-2">
            <div className="bg-black text-white pt-6 md:pt-0">
              <div className="space-y-6 w-full lg:col-span-2 lg:ml-auto">
                <h3 className="text-sm uppercase tracking-widest font-medium">
                  Subscribe to our newsletter
                </h3>

                {/* Input + Submit */}
                <form onSubmit={onSubscribe}>
                  <div className="flex w-full border border-white">
                    <input
                      type="email"
                      placeholder="Email Address *"
                      className="flex-1 px-4 py-2 bg-white text-black placeholder:text-black focus:outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`px-6 py-2 text-xs uppercase tracking-wide transition ${
                        isFormValid
                          ? "bg-black text-white hover:bg-white hover:text-black cursor-pointer"
                          : "bg-black text-white cursor-not-allowed"
                      }`}
                    >
                      Submit
                    </button>
                  </div>
                </form>
                {message && (
                  <div
                    className={`mt-2 text-sm ${
                      isSuccess ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Checkbox */}
                <label className="flex items-start text-xs space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4"
                    checked={accepted}
                    onChange={() => setAccepted(!accepted)}
                  />
                  <span className="mt-1">
                    I accept the{" "}
                    <Link href="/privacy-policy" className="underline">
                      Privacy & Cookies Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms" className="underline">
                      Terms & Conditions
                    </Link>
                    *
                  </span>
                </label>

                {/* Social Icons */}
                <div className="space-y-4 hidden lg:block">
                  <h4 className="text-sm uppercase tracking-widest font-medium">
                    Follow us
                  </h4>
                  <div className="flex space-x-4 text-white">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="h-6 w-6 text-white hover:text-gray-600" />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook className="h-6 w-6 text-white hover:text-gray-600" />
                    </a>
                  </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-6 text-xs flex items-center text-white/70 space-x-4 flex-wrap">
                  <p>© {currentYear}</p>
                  <Link href="/privacy-policy" className="hover:underline">
                    Privacy & Cookies Policy
                  </Link>
                  <Link href="/terms" className="hover:underline">
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
