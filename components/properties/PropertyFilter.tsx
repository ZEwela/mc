"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { propertyTypes, type PropertyFilters } from "@/types/property";
import { Filter, X, Search, ChevronUp, ChevronDown } from "lucide-react";

interface PropertyFilterProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  initialFilters?: PropertyFilters;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function PropertyFilter({
  onFiltersChange,
  initialFilters = {},
  searchQuery = "",
  onSearchChange,
}: PropertyFilterProps) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof PropertyFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== ""
  );

  const hasActiveSearch = searchQuery.trim().length > 0;
  const hasAnyActiveFilters = hasActiveFilters || hasActiveSearch;

  const activeFilterCount = [
    ...Object.values(filters).filter(
      (v) => v !== undefined && v !== null && v !== ""
    ),
    ...(hasActiveSearch ? [searchQuery] : []),
  ].length;

  return (
    <div className="mb-8">
      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by title, location, or property type..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          {hasActiveSearch && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {isOpen ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
          {hasAnyActiveFilters && (
            <span className="ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {hasAnyActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-sm">
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {isOpen && (
        <Card>
          <CardHeader>
            <h3 className="text-gray-500 text-lg font-semibold">
              Advanced Filters
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  className="text-gray-500 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  value={filters.location || ""}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value || undefined)
                  }
                >
                  <option value="">All Locations</option>
                  <option value="Lake District">Lake District</option>
                  <option value="Yorkshire Dales">Yorkshire Dales</option>
                  <option value="Peak District">Peak District</option>
                  <option value="Cotswolds AONB">Cotswolds AONB</option>
                  <option value="New Forest">New Forest</option>
                  <option value="Snowdonia National Park">
                    Snowdonia National Park
                  </option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  className="text-gray-500 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  value={filters.property_type || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "property_type",
                      e.target.value || undefined
                    )
                  }
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (£)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.min_price || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "min_price",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (£)
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filters.max_price || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "max_price",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Bedrooms
                </label>
                <select
                  className="text-gray-500 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  value={filters.min_bedrooms || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "min_bedrooms",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}+
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Bedrooms
                </label>
                <select
                  className="text-gray-500 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  value={filters.max_bedrooms || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "max_bedrooms",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Properties
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                    checked={filters.featured || false}
                    onChange={(e) =>
                      handleFilterChange(
                        "featured",
                        e.target.checked || undefined
                      )
                    }
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Show only featured properties
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
