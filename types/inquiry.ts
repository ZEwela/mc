// export interface Inquiry {
//   id?: string;
//   type?: "property" | "general";
//   related_id?: string;
//   name: string;
//   email: string;
//   phone?: string;
//   message: string;
//   status?: "new" | "in_progress" | "completed";
//   created_at?: string;
// }

// Represents an individual inquiry
export interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  preferred_location: string;
  budget_range: string;
  message: string;
  status: "New" | "Contacted" | "Closed"; // adjust as needed
  priority: "Low" | "Medium" | "High"; // adjust as needed
  created_at: string;
}

// For filtering inquiries in the FiltersBar
export interface Filters {
  search: string;
  status: string | null;
  priority: string | null;
}

// Inquiry statistics for the dashboard
export interface Stats {
  total_inquiries: number;
  new_inquiries: number;
  today_inquiries?: number;
  week_inquiries?: number;
  contacted_inquiries: number;
  month_inquiries?: number;
  closed_inquiries: number;
}
