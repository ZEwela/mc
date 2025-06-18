"use client";

import { useState, useMemo, useEffect } from "react";
import { usePaginatedProperties } from "@/lib/hooks/useProperties";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyFilter } from "@/components/properties/PropertyFilter";
import { useRouter } from "next/navigation";

import {
  PropertySort,
  type SortOption,
} from "@/components/properties/PropertySort";
import type { PropertyFilters } from "@/types/property";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/Button";
import { useInView } from "react-intersection-observer";

export default function PropertiesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({ threshold: 1 });

  const { properties, loading, error, hasMore, totalCount } =
    usePaginatedProperties(filters, page);

  const session = useSession();
  const isAuthenticated = !!session;

  // Load next page when user scrolls to bottom
  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading, hasMore]);

  // Filter properties by search query
  const searchedProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;

    const query = searchQuery.toLowerCase();
    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(query) ||
        property.location?.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query) ||
        property.property_type?.toLowerCase().includes(query)
    );
  }, [properties, searchQuery]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...searchedProperties];

    switch (sortBy) {
      case "price_low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price_high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "bedrooms_low":
        return sorted.sort((a, b) => (a.bedrooms || 0) - (b.bedrooms || 0));
      case "bedrooms_high":
        return sorted.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0));
      default:
        return sorted;
    }
  }, [searchedProperties, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Affordable Nordic Homes in National Parks
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover exceptional Scandinavian-inspired homes under £100,000
              within the UK&apos;s most iconic national parks. Each property
              offers modern Nordic design surrounded by protected natural
              landscapes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 bg-[#F5F1EC]">
        {/* Filters */}
        <PropertyFilter onFiltersChange={setFilters} initialFilters={filters} />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8 flex-col gap-4 md:flex-row">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {loading
                ? "Loading..."
                : Object.keys(filters).length === 0 && totalCount !== null
                ? `${totalCount} Properties Available`
                : `${sortedProperties.length} Properties`}
            </h2>
          </div>

          {!loading && sortedProperties.length > 0 && (
            <PropertySort currentSort={sortBy} onSortChange={setSortBy} />
          )}
          {isAuthenticated && (
            <div className="flex justify-end mb-6">
              <Button
                variant="outline"
                onClick={() => router.push("/properties/new")}
                className="  px-4 py-2 rounded hover:bg-gray-800"
              >
                + Add New Property
              </Button>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        <PropertyGrid properties={sortedProperties} loading={loading} />

        {/* Infinite Scroll Loader */}
        <div ref={ref} className="text-center py-6">
          {loading && <span className="text-gray-500">Loading more...</span>}
        </div>
      </div>
    </div>
  );
}
