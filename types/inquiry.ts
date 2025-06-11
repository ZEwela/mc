export interface Inquiry {
  id?: string;
  type?: "property" | "general";
  related_id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: "new" | "in_progress" | "completed";
  created_at?: string;
}
