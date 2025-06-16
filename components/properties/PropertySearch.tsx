"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface PropertySearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function PropertySearch({
  onSearch,
  placeholder = "Search by location, or keyword...",
}: PropertySearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-24 h-14 text-lg border-2 border-gray-200 focus:border-gray-900 rounded-lg"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gray-900 hover:bg-gray-800"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
