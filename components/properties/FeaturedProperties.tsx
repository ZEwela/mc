"use client";

import { useProperties } from "@/lib/hooks/useProperties";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function FeaturedProperties() {
  const { properties, loading } = useProperties({ featured: true });
  const featuredProperties = properties.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 ">
        <div className="mx-20 px-4">
          {/* Title and button */}
          <div className="mb-6 max-w-7xl mx-auto  flex items-center">
            {/* Left placeholder to take same space as button */}
            <div className="flex-1" />

            {/* Center title */}
            <h2 className="flex-1 text-center text-sm font-mono text-gray-900 tracking-wide">
              FEATURED PROPERTIES
            </h2>

            {/* Right button */}
            <div className="flex-1 flex justify-end">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="">
                <div className="bg-gray-200 h-64 " />
                <div className="p-6 bg-white  border border-t-0 border-gray-200">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-9xl md:mx-25 px-4 ">
        {/* Title and button */}
        <div
          className={`mb-6 flex flex-col md:flex-row items-center ${
            featuredProperties.length === 0 ? "justify-center" : ""
          }`}
        >
          {/* Left placeholder to take same space as button */}
          {featuredProperties.length > 0 && <div className="flex-1" />}

          {/* Center title */}
          <h2
            className={`flex-1 text-sm font-mono text-gray-900 tracking-wide text-center ${
              featuredProperties.length > 0 ? "" : "md:text-center"
            }`}
          >
            FEATURED PROPERTIES
          </h2>

          {featuredProperties.length > 0 && (
            <div className="hidden md:flex flex-1 justify-end">
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
          )}
        </div>

        {featuredProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} tallImage />
              ))}
            </div>

            {/* Button: visible only on small, aligned right below gallery */}
            <div className="flex justify-center md:hidden">
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
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-6">
              No featured properties available at the moment.
            </p>
            <Link href="/properties" passHref>
              <Button
                variant="outline"
                size="md"
                className="w-48 mx-auto md:mx-0 text-xs tracking-wider"
              >
                BROWSE ALL PROPERTIES
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
