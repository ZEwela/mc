export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number | null;
          location: string | null;
          property_type: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          square_feet: number | null;
          year_built: number | null;
          images: string[] | null;
          features: string[] | null;
          status: string | null;
          featured: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price?: number | null;
          location?: string | null;
          property_type?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_feet?: number | null;
          year_built?: number | null;
          images?: string[] | null;
          features?: string[] | null;
          status?: string | null;
          featured?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number | null;
          location?: string | null;
          property_type?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_feet?: number | null;
          year_built?: number | null;
          images?: string[] | null;
          features?: string[] | null;
          status?: string | null;
          featured?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      inquiries: {
        Row: {
          id: string;
          type: string | null;
          related_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          type?: string | null;
          related_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          type?: string | null;
          related_id?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          status?: string | null;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
