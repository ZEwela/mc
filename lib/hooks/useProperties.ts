"use client";

import { useState, useEffect, useCallback } from "react";
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
const PAGE_SIZE = 12;
export function usePaginatedProperties(filters: PropertyFilters = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Reset everything when filters change
  const resetState = useCallback(() => {
    setProperties([]);
    setHasMore(true);
    setTotalCount(null);
    setError(null);
  }, []);

  // Build query with filters
  const buildQuery = useCallback(
    (isCountQuery = false) => {
      let query = supabase
        .from("properties")
        .select(isCountQuery ? "*" : "*", {
          count: isCountQuery ? "exact" : undefined,
          head: isCountQuery,
        })
        .eq("status", filters?.status || "available");

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

      if (!isCountQuery) {
        query = query.order("created_at", { ascending: false });
      }

      return query;
    },
    [filters]
  );

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get total count and first page in parallel
      const [countResult, dataResult] = await Promise.all([
        buildQuery(true),
        buildQuery(false).range(0, PAGE_SIZE - 1),
      ]);

      if (countResult.error) throw countResult.error;
      if (dataResult.error) throw dataResult.error;

      const total = countResult.count || 0;
      const data = dataResult.data || [];

      setTotalCount(total);
      setProperties(data);
      setHasMore(data.length === PAGE_SIZE && data.length < total);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load properties"
      );
      setProperties([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const from = properties.length;
      const to = from + PAGE_SIZE - 1;

      const { data, error: dataError } = await buildQuery(false).range(
        from,
        to
      );

      if (dataError) throw dataError;

      const newData = data || [];

      setProperties((prev) => [...prev, ...newData]);

      // Update hasMore based on what we received and total count
      const newTotal = properties.length + newData.length;
      setHasMore(newData.length === PAGE_SIZE && newTotal < (totalCount || 0));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more properties"
      );
    } finally {
      setLoading(false);
    }
  }, [buildQuery, loading, hasMore, properties.length, totalCount]);

  // Reset and load when filters change
  useEffect(() => {
    resetState();
    loadInitialData();
  }, [loadInitialData, resetState]);

  return {
    properties,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
  };
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
