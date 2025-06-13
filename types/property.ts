export interface Property {
  id: string;
  title: string;
  description?: string;
  price?: number;
  location?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year_built?: number;
  images?: string[];
  features?: string[];
  status?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFilters {
  location?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  architect?: string;
  featured?: boolean;
}
