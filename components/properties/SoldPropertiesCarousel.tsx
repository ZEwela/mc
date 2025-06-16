"use client";

import { useProperties } from "@/lib/hooks/useProperties";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Slider from "react-slick";

export function SoldPropertiesCarousel() {
  const { properties, loading } = useProperties({ status: "sold" });
  const soldProperties = properties.slice(0, 6);

  const settings = {
    dots: true,
    infinite: soldProperties.length > 3,
    speed: 500,
    slidesToShow: Math.min(soldProperties.length, 3), // max 3 visible at a time
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(soldProperties.length, 2),
          slidesToScroll: 1,
          infinite: soldProperties.length > 2,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: soldProperties.length > 1,
          dots: true,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="mx-20 px-4">
          <h2 className="text-center text-sm font-mono text-gray-900 tracking-wide mb-6">
            SOLD PROPERTIES
          </h2>
          <p className="text-center text-gray-600">Loading properties...</p>
        </div>
      </section>
    );
  }

  console.log("sold", soldProperties);

  if (soldProperties.length === 0) {
    return (
      <section className="py-16">
        <div className="mx-20 px-4">
          <h2 className="text-center text-sm font-mono text-gray-900 tracking-wide mb-6">
            SOLD PROPERTIES
          </h2>
          <p className="text-center text-gray-600">
            No sold properties available.
          </p>
          <div className="text-center mt-6">
            <Link href="/properties" passHref>
              <Button
                variant="outline"
                size="md"
                className="text-xs tracking-wider"
              >
                BROWSE ALL PROPERTIES
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 ">
        {/* Title and button */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-mono text-gray-900 tracking-wide">
            SOLD PROPERTIES
          </h2>
          <Link href="/properties" passHref>
            <Button
              variant="outline"
              size="md"
              className="text-xs tracking-wider"
            >
              BROWSE ALL PROPERTIES
            </Button>
          </Link>
        </div>
        <div className="relative max-w-7xl mx-auto  overflow-hidden">
          <Slider {...settings}>
            {soldProperties.map((property) => (
              <div key={property.id} className="px-2">
                <PropertyCard property={property} tallImage />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
