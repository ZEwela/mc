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

  // Reset state when filters change
  useEffect(() => {
    setProperties([]);
    setHasMore(true);
    setTotalCount(null);
    setError(null);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    const fetchProperties = async () => {
      // Calculate the offset for this page
      const from = (page - 1) * pageSize;

      // If we already know the total count and the offset exceeds it, don't fetch
      if (totalCount !== null && from >= totalCount) {
        setHasMore(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // First, get the total count if we don't have it yet
        if (totalCount === null) {
          let countQuery = supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("status", filters?.status || "available");

          // Apply the same filters for count
          if (filters?.location) {
            countQuery = countQuery.ilike("location", `%${filters.location}%`);
          }
          if (filters?.property_type) {
            countQuery = countQuery.eq("property_type", filters.property_type);
          }
          if (filters?.min_price) {
            countQuery = countQuery.gte("price", filters.min_price);
          }
          if (filters?.max_price) {
            countQuery = countQuery.lte("price", filters.max_price);
          }
          if (filters?.min_bedrooms) {
            countQuery = countQuery.gte("bedrooms", filters.min_bedrooms);
          }
          if (filters?.max_bedrooms) {
            countQuery = countQuery.lte("bedrooms", filters.max_bedrooms);
          }
          if (filters?.featured !== undefined) {
            countQuery = countQuery.eq("featured", filters.featured);
          }

          const { count, error: countError } = await countQuery;

          if (countError) throw countError;

          setTotalCount(count || 0);

          // If the offset exceeds the total count, don't proceed with data fetch
          if (count !== null && from >= count) {
            setHasMore(false);
            setLoading(false);
            return;
          }
        }

        // Now fetch the actual data
        let dataQuery = supabase
          .from("properties")
          .select("*")
          .eq("status", filters?.status || "available")
          .order("created_at", { ascending: false });

        // Apply filters
        if (filters?.location) {
          dataQuery = dataQuery.ilike("location", `%${filters.location}%`);
        }
        if (filters?.property_type) {
          dataQuery = dataQuery.eq("property_type", filters.property_type);
        }
        if (filters?.min_price) {
          dataQuery = dataQuery.gte("price", filters.min_price);
        }
        if (filters?.max_price) {
          dataQuery = dataQuery.lte("price", filters.max_price);
        }
        if (filters?.min_bedrooms) {
          dataQuery = dataQuery.gte("bedrooms", filters.min_bedrooms);
        }
        if (filters?.max_bedrooms) {
          dataQuery = dataQuery.lte("bedrooms", filters.max_bedrooms);
        }
        if (filters?.featured !== undefined) {
          dataQuery = dataQuery.eq("featured", filters.featured);
        }

        // Apply range
        const to = from + pageSize - 1;
        dataQuery = dataQuery.range(from, to);

        const { data, error: dataError } = await dataQuery;

        if (dataError) throw dataError;

        // Update properties
        if (page === 1) {
          setProperties(data || []);
        } else {
          setProperties((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProps = (data || []).filter((p) => !existingIds.has(p.id));
            return [...prev, ...newProps];
          });
        }

        // Update hasMore based on what we received
        const receivedCount = data?.length || 0;
        const currentTotalLoaded =
          page === 1 ? receivedCount : properties.length + receivedCount;
        const knownTotal = totalCount || 0;

        setHasMore(
          receivedCount === pageSize && currentTotalLoaded < knownTotal
        );
      } catch (err) {
        // Handle the specific PostgREST range error gracefully
        if (err instanceof Error && err.message.includes("PGRST103")) {
          setHasMore(false);
        } else {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [JSON.stringify(filters), page, pageSize, totalCount]);

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
