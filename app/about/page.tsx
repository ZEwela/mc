import { TearEffect } from "@/components/common/TearEffect";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
  const topContent = (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-y-10 text-left">
        {/* Stat 1 */}
        <div>
          <p className="text-4xl md:text-3xl font-light text-gray-900">8</p>
          <p className="text-sm md:text-base text-gray-600 uppercase tracking-wide mt-2">
            National Parks
          </p>
        </div>

        {/* Stat 2 */}
        <div>
          <p className="text-4xl md:text-3xl font-light text-gray-900">45+</p>
          <p className="text-sm md:text-base text-gray-600 uppercase tracking-wide mt-2">
            Properties Sold
          </p>
        </div>
      </div>
    </div>
  );
  const bottomText = (
    <div className="max-w-9xl p-6 md:p-10 bg-cover bg-center text-black">
      <div className="flex flex-wrap justify-center gap-8">
        {/* Testimonial 1 */}
        <div className="flex-1 min-w-[280px] max-w-md">
          <p className="text-md md:text-xl font-mono leading-relaxed text-center mb-4">
            &quot;The attention to detail and understanding of what makes a
            property special in these protected environments is unmatched. They
            delivered exactly what we dreamed of in the Cotswolds.&quot;
          </p>
          <p className="italic text-center">- Sarah Thompson, Cotswolds</p>
        </div>

        {/* Testimonial 2 */}
        <div className="flex-1 min-w-[280px] max-w-md">
          <p className="text-md md:text-xl font-mono leading-relaxed text-center mb-4">
            &quot;The team really understood what I was looking for and the type
            of property that would suit my lifestyle. They presented carefully
            curated options with no time-wasters, and their knowledge of the
            national parks was extraordinary. They helped me find the perfect
            Lake District retreat through their extensive network and market
            expertise. All in all, a great experience.&quot;
          </p>
          <p className="italic text-center">- Kate Griffin, Buyer</p>
        </div>
      </div>

      {/* Third testimonial centered below */}
      <div className="flex justify-center mt-8 max-w-md mx-auto">
        <div className="flex-1 min-w-[280px]">
          <p className="text-md md:text-xl font-mono leading-relaxed text-center mb-4">
            &quot;Mont Cervin found us a stunning property in the Peak District
            that perfectly blended modern Scandinavian design with the rugged
            beauty of the national park. Their expertise in protected landscapes
            was invaluable.&quot;
          </p>
          <p className="italic text-center">
            - James Mitchell, Yorkshire Dales
          </p>
        </div>
      </div>

      {/* Contact Button */}
      <div className="flex justify-center mt-10">
        <Link href="/contact" passHref>
          <Button
            variant="outline"
            size="md"
            className="text-xs tracking-wider text-black border-black hover:bg-gray-300/40 hover:text-gray-800"
          >
            CONTACT US
          </Button>
        </Link>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      {/* Top Background Image */}
      <div
        className="w-full h-[60vh] sm:h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/pricilla-parras-G9ypih4F9po-unsplash-window-view.jpg')", // Ensure the image is in /public
        }}
      />

      {/* Text Content Below */}
      <div className="text-black text-center px-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-light mb-6">About</h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed mx-auto font-mono">
          Mont Cervin specialises in connecting discerning buyers with
          exceptional Scandinavian-inspired properties within the UK&apos;s most
          iconic national parks and areas of outstanding natural beauty. From
          the dramatic fells of the Lake District to the rolling dales of
          Yorkshire, our curated portfolio features architecturally
          distinguished homes that embody the perfect synthesis of Nordic design
          principles and England&apos;s protected heritage landscapes. Each
          property is selected for its design integrity, build quality,
          privileged location within protected environments, and potential for
          both personal enjoyment and long-term investment value.
        </p>
      </div>
      <hr className="border-t border-gray-300 my-12 w-3/4 mx-auto" />
      <TearEffect
        topContent={topContent}
        topColor="#F5F1EC"
        bottomContent={bottomText}
        bottomColor="white"
      />
    </div>
  );
}
