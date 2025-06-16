"use client";

import { useState, useMemo } from "react";
import { useProperties } from "@/lib/hooks/useProperties";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyFilter } from "@/components/properties/PropertyFilter";

import {
  PropertySort,
  type SortOption,
} from "@/components/properties/PropertySort";
import type { PropertyFilters } from "@/types/property";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const { properties, loading, error } = useProperties(filters);

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {loading ? "Loading..." : `${sortedProperties.length} Properties`}
            </h2>
          </div>

          {!loading && sortedProperties.length > 0 && (
            <PropertySort currentSort={sortBy} onSortChange={setSortBy} />
          )}
        </div>

        {/* Properties Grid */}
        <PropertyGrid properties={sortedProperties} loading={loading} />
      </div>
    </div>
  );
}
