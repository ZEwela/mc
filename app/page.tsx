"use client";
import { Hero } from "@/components/common/Hero";
import { TearEffect } from "@/components/common/TearEffect";
import { FeaturedProperties } from "@/components/properties/FeaturedProperties";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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

  const aboutTeaser = (
    <div className=" max-w-5xl mx-auto flex flex-col justify-center items-center text-white p-15 md:p-35 bg-cover bg-center">
      <p className="text-md md:text-xl font-mono leading-relaxed text-center">
        &quot;The attention to detail and understanding of what makes a property
        special in these protected environments is unmatched. They delivered
        exactly what we dreamed of in the Cotswolds.&quot;
        <span className="italic text-white"> - Sarah Thompson, Cotswolds</span>
      </p>
      <div className="flex justify-center mt-5">
        <Link href="/about" passHref>
          <Button
            variant="outline"
            size="md"
            className="text-xs tracking-wider text-white border-white hover:bg-gray-300/40 hover:text-gray-800"
          >
            ABOUT
          </Button>
        </Link>
      </div>
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
      <TearEffect
        topColor={"white"}
        topBackgroundImage="/assets/kateryna-horska-OgzA9trJqnI-unsplash-bath.jpg"
        bottomColor={"#F5F1EC"}
        topContent={aboutTeaser}
        bottomContent={<FeaturedProperties />}
      />
    </>
  );
}
