"use client";
import { Hero } from "@/components/common/Hero";
import { TearEffect } from "@/components/common/TearEffect";
import { FeaturedProperties } from "@/components/properties/FeaturedProperties";

export default function HomePage() {
  const topText = (
    <div className="max-w-3xl mx-auto flex  flex-col justify-center items-center text-gray-900  p-15">
      <h2 className="md:text-3xl text-2xl font-light mb-4 text-center">
        Affordable Nordic Homes in National Parks
      </h2>
      <p className="text-md md:text-xl font-light leading-relaxed text-center">
        Discover exceptional Scandinavian-inspired homes under £100,000 within
        the UK&apos;s most iconic national parks. Each property offers modern
        Nordic design surrounded by protected natural landscapes.
      </p>
    </div>
  );

  return (
    <>
      <Hero
        title="Mont Cervin"
        subtitle="Exceptional homes within the UK's most iconic national parks and protected landscapes"
        backgroundImage="/assets/clay-banks-NFz1Up96P8E-unsplash-large.jpg"
      />
      <TearEffect
        topColor={"white"}
        bottomColor={"#F5F1EC"}
        topContent={topText}
        bottomContent={<FeaturedProperties />}
      />
    </>
  );
}
