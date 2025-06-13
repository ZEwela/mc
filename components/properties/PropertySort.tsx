"use client";

import { ChevronDown } from "lucide-react";

export type SortOption =
  | "newest"
  | "oldest"
  | "price_low"
  | "price_high"
  | "bedrooms_low"
  | "bedrooms_high";

interface PropertySortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS = [
  //   { value: "newest" as SortOption, label: "Newest First" },
  //   { value: "oldest" as SortOption, label: "Oldest First" },
  { value: "price_low" as SortOption, label: "Price: Low to High" },
  { value: "price_high" as SortOption, label: "Price: High to Low" },
  { value: "bedrooms_low" as SortOption, label: "Bedrooms: Low to High" },
  { value: "bedrooms_high" as SortOption, label: "Bedrooms: High to Low" },
];

export function PropertySort({ currentSort, onSortChange }: PropertySortProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
