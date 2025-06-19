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
  const [skeletonCount, setSkeletonCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousPropertiesRef = useRef<Property[]>([]);

  // Handle smooth transition of new properties
  useEffect(() => {
    const previous = previousPropertiesRef.current;

    const isInitialLoad = previous.length === 0;
    const isFilterChange =
      properties.length &&
      previous.length &&
      properties[0]?.id !== previous[0]?.id;
    const isPagination = properties.length > previous.length;

    if (isInitialLoad || isFilterChange) {
      setDisplayedProperties(properties);
      previousPropertiesRef.current = properties;
      return;
    }

    if (isPagination) {
      const newItems = properties.slice(previous.length);
      if (newItems.length > 0) {
        setSkeletonCount(newItems.length);
        setIsAnimating(true);

        // Delay to trigger animation
        const timer = setTimeout(() => {
          setDisplayedProperties(properties);
          previousPropertiesRef.current = properties;

          setTimeout(() => {
            setIsAnimating(false);
            setSkeletonCount(0);
          }, 300); // duration of animation
        }, 100);

        return () => clearTimeout(timer);
      }
    } else {
      setDisplayedProperties(properties);
      previousPropertiesRef.current = properties;
    }
  }, [properties]);

  // Render loading skeletons on initial load
  if (loading && displayedProperties.length === 0) {
    return <SkeletonGrid count={6} />;
  }

  // Empty state
  if (!loading && displayedProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  // Total number of items to show including loading placeholders
  const totalCount = displayedProperties.length + skeletonCount;
  const estimatedRowHeight = 420; // approx card height with spacing

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      style={{
        minHeight: `${Math.ceil(totalCount / 3) * estimatedRowHeight}px`,
      }}
    >
      {displayedProperties.map((property, index) => {
        const wasNew = index >= (previousPropertiesRef.current?.length || 0);

        return (
          <div
            key={property.id}
            className={`
              transition-all duration-500 ease-out
              ${
                wasNew && isAnimating
                  ? "opacity-0 translate-y-4 scale-95"
                  : "opacity-100 translate-y-0 scale-100"
              }
            `}
            style={{
              transitionDelay: wasNew ? `${(index % 3) * 100}ms` : "0ms",
            }}
          >
            <PropertyCard property={property} />
          </div>
        );
      })}

      {/* Inline loading cards during pagination */}
      {skeletonCount > 0 &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
    </div>
  );
}

// Skeleton for grid layout
function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Single card skeleton
function SkeletonCard() {
  return (
    <div className="animate-pulse">
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
  );
}
