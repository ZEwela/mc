import { PropertyCard } from "./PropertyCard";
import type { Property } from "@/types/property";
import { useState, useEffect, useRef } from "react";

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
}

export function PropertyGrid({ properties, loading }: PropertyGridProps) {
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>(
    []
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const previousPropertiesRef = useRef<Property[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const [skeletonCount, setSkeletonCount] = useState(0);

  // Handle smooth property updates
  useEffect(() => {
    const previousProperties = previousPropertiesRef.current;

    // If this is the initial load or a filter change (completely different properties)
    if (
      previousProperties.length === 0 ||
      (properties.length > 0 &&
        previousProperties.length > 0 &&
        properties[0]?.id !== previousProperties[0]?.id)
    ) {
      setDisplayedProperties(properties);
      previousPropertiesRef.current = properties;
      return;
    }

    // If new properties are being added (pagination)
    if (properties.length > previousProperties.length) {
      const newProperties = properties.slice(previousProperties.length);

      if (newProperties.length > 0) {
        setSkeletonCount(newProperties.length);
        setIsAnimating(true);

        // Add new properties with a slight delay for smooth appearance
        const timer = setTimeout(() => {
          setDisplayedProperties(properties);
          previousPropertiesRef.current = properties;

          // Reset animation state after properties are added
          setTimeout(() => {
            setIsAnimating(false);
            setSkeletonCount(0);
          }, 300);
        }, 100);

        return () => clearTimeout(timer);
      }
    } else {
      // For other updates, update immediately
      setDisplayedProperties(properties);
      previousPropertiesRef.current = properties;
    }
  }, [properties]);

  // Loading skeleton
  if (loading && displayedProperties.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-t-lg" />
            <div className="p-6 bg-white rounded-b-lg border border-t-0 border-gray-200">
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
              <div className="flex space-x-4 mb-4">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!loading && displayedProperties.length === 0) {
    return (
      <div className="text-center py-12 ">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      style={{
        minHeight: loading
          ? `${Math.ceil(displayedProperties.length / 3) * 400}px`
          : "auto",
      }}
    >
      {displayedProperties.map((property, index) => {
        const isNewProperty =
          index >= (previousPropertiesRef.current?.length || 0);

        return (
          <div
            key={property.id}
            className={`
              transition-all duration-500 ease-out
              ${
                isNewProperty && isAnimating
                  ? "opacity-0 translate-y-4 scale-95"
                  : "opacity-100 translate-y-0 scale-100"
              }
            `}
            style={{
              transitionDelay: isNewProperty ? `${(index % 3) * 100}ms` : "0ms",
            }}
          >
            <PropertyCard property={property} />
          </div>
        );
      })}

      {/* Inline loading cards for pagination */}
      {loading && displayedProperties.length > 0 && (
        <>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={`loading-${i}`} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-t-lg" />
              <div className="p-6 bg-white rounded-b-lg border border-t-0 border-gray-200">
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
                <div className="flex space-x-4 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
