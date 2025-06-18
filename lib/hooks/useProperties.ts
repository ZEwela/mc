"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Property, PropertyFilters } from "@/types/property";

export function useProperties(filters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        let query = supabase
          .from("properties")
          .select("*")
          .eq("status", filters?.status || "available")
          .order("created_at", { ascending: false });

        // Apply filters
        if (filters?.location) {
          query = query.ilike("location", `%${filters.location}%`);
        }
        if (filters?.property_type) {
          query = query.eq("property_type", filters.property_type);
        }
        if (filters?.min_price) {
          query = query.gte("price", filters.min_price);
        }
        if (filters?.max_price) {
          query = query.lte("price", filters.max_price);
        }
        if (filters?.min_bedrooms) {
          query = query.gte("bedrooms", filters.min_bedrooms);
        }
        if (filters?.max_bedrooms) {
          query = query.lte("bedrooms", filters.max_bedrooms);
        }
        if (filters?.featured !== undefined) {
          query = query.eq("featured", filters.featured);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [JSON.stringify(filters)]);

  return { properties, loading, error };
}

export function usePaginatedProperties(
  filters: PropertyFilters = {},
  page = 1,
  pageSize = 12
) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    setProperties([]); // reset properties if filters change
    setHasMore(true);
    setTotalCount(null);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("properties")
          .select("*", { count: "exact" })
          .eq("status", filters?.status || "available")
          .order("created_at", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        console.log("fetching more", page);

        // Apply filters
        if (filters?.location) {
          query = query.ilike("location", `%${filters.location}%`);
        }
        if (filters?.property_type) {
          query = query.eq("property_type", filters.property_type);
        }
        if (filters?.min_price) {
          query = query.gte("price", filters.min_price);
        }
        if (filters?.max_price) {
          query = query.lte("price", filters.max_price);
        }
        if (filters?.min_bedrooms) {
          query = query.gte("bedrooms", filters.min_bedrooms);
        }
        if (filters?.max_bedrooms) {
          query = query.lte("bedrooms", filters.max_bedrooms);
        }
        if (filters?.featured !== undefined) {
          query = query.eq("featured", filters.featured);
        }

        const { data, error, count } = await query;

        if (count !== null && count !== undefined) {
          setTotalCount(count);
        }

        if (error) throw error;

        if (data.length < pageSize) {
          setHasMore(false); // no more results
        }

        setProperties((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newProps = data.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newProps];
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [JSON.stringify(filters), page]);

  return { properties, loading, error, hasMore, totalCount };
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Property not found");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return { property, loading, error };
}
