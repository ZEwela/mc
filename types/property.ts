export interface Property {
  id: string;
  title: string;
  description?: string;
  price?: number;
  location?: string;
  property_type?: PropertyType;
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
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  featured?: boolean;
}

export type PropertyType =
  | "Farmhouse"
  | "Cottage"
  | "Country House"
  | "Barn Conversion"
  | "Cabin"
  | "Detached House";

export const locations = [
  "Lake District",
  "Yorkshire Dales",
  "Peak District",
  "Cotswolds AONB",
  "New Forest",
  "Snowdonia National Park",
];

export const propertyTypes: PropertyType[] = [
  "Farmhouse",
  "Cottage",
  "Country House",
  "Barn Conversion",
  "Cabin",
  "Detached House",
];
