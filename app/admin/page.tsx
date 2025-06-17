"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Mail,
  Calendar,
  User,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  LogOut,
  Users,
} from "lucide-react";
import { Inquiry, Stats, Filters } from "@/types/inquiry";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  // Authentication state
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Data state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_inquiries: 0,
    new_inquiries: 0,
    contacted_inquiries: 0,
    closed_inquiries: 0,
    today_inquiries: 0,
    week_inquiries: 0,
    month_inquiries: 0,
  });

  const [emailRecipient, setEmailRecipient] = useState<Inquiry | null>(null);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    template: "initial_contact",
  });

  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    budget_range: "",
    preferred_location: "",
    message: "",
    status: "new" as Inquiry["status"],
    priority: "medium" as Inquiry["priority"],
  });

  // UI state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    priority: "all",
    search: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Style mappings
  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const priorityColors: Record<string, string> = {
    high: "bg-red-100 text-red-800",
    medium: "bg-orange-100 text-orange-800",
    low: "bg-gray-100 text-gray-800",
  };

  // Authentication effect
  useEffect(() => {
    async function initializeAuth() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);

      if (!data.session) {
        router.push("/login");
      }
    }

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Email templates
  const emailTemplates = {
    initial_contact: {
      subject: "Thank you for your property inquiry",
      message: `Dear {{first_name}},

Thank you for your interest in our properties. We have received your inquiry regarding {{preferred_location}} with a budget of {{budget_range}}.

Our team will review your requirements and get back to you within 24 hours with suitable options.

Best regards,
Property Team`,
    },
    follow_up: {
      subject: "Following up on your property inquiry",
      message: `Dear {{first_name}},

We wanted to follow up on your recent property inquiry. We have some exciting options that match your criteria for {{preferred_location}}.

Would you be available for a call this week to discuss these opportunities?

Best regards,
Property Team`,
    },
    custom: {
      subject: "",
      message: "",
    },
  };

  // Data loading functions
  const loadInquiries = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error loading inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const loadStats = async (): Promise<void> => {
    try {
      const queries = await Promise.all([
        supabase.from("inquiries").select("*"),
        supabase.from("inquiries").select("*").eq("status", "new"),
        supabase.from("inquiries").select("*").eq("status", "contacted"),
        supabase.from("inquiries").select("*").eq("status", "closed"),
        supabase
          .from("inquiries")
          .select("*")
          .gte("created_at", getDateString(0)),
        supabase
          .from("inquiries")
          .select("*")
          .gte("created_at", getDateString(7)),
        supabase
          .from("inquiries")
          .select("*")
          .gte("created_at", getDateString(30)),
      ]);

      const [total, newData, contacted, closed, today, week, month] = queries;

      setStats({
        total_inquiries: total.data?.length || 0,
        new_inquiries: newData.data?.length || 0,
        contacted_inquiries: contacted.data?.length || 0,
        closed_inquiries: closed.data?.length || 0,
        today_inquiries: today.data?.length || 0,
        week_inquiries: week.data?.length || 0,
        month_inquiries: month.data?.length || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleEmailAction = (inquiry: Inquiry) => {
    setEmailRecipient(inquiry);
    const template = emailTemplates.initial_contact;
    setEmailData({
      subject: template.subject,
      message: template.message
        .replace("{{first_name}}", inquiry.first_name)
        .replace("{{preferred_location}}", inquiry.preferred_location)
        .replace("{{budget_range}}", inquiry.budget_range),
      template: "initial_contact",
    });
    setShowEmailModal(true);
  };

  type TemplateKey = "initial_contact" | "follow_up" | "custom";

  // Template change handler
  const handleTemplateChange = (templateKey: TemplateKey) => {
    if (!emailRecipient) return;

    const template = emailTemplates[templateKey];
    setEmailData({
      subject: template.subject.replace(
        "{{first_name}}",
        emailRecipient.first_name
      ),
      message: template.message
        .replace("{{first_name}}", emailRecipient.first_name)
        .replace("{{preferred_location}}", emailRecipient.preferred_location)
        .replace("{{budget_range}}", emailRecipient.budget_range),
      template: templateKey,
    });
  };

  const searchInquiries = async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) {
      loadInquiries();
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,preferred_location.ilike.%${searchTerm}%`
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error searching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!emailRecipient) return;

    try {
      setIsLoading(true);

      //  Sengrid for trial
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailRecipient.email,
          subject: emailData.subject,
          message: emailData.message,
          inquiry_id: emailRecipient.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      // Update inquiry status to 'contacted' after sending email
      await updateInquiryStatus(emailRecipient.id, "contacted");

      // Log the email activity (you might want to create an email_logs table)
      await supabase.from("email_logs").insert({
        inquiry_id: emailRecipient.id,
        subject: emailData.subject,
        message: emailData.message,
        sent_at: new Date().toISOString(),
      });

      setShowEmailModal(false);
      setEmailRecipient(null);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAction = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry);
    setEditForm({
      first_name: inquiry.first_name,
      last_name: inquiry.last_name,
      email: inquiry.email,
      budget_range: inquiry.budget_range,
      preferred_location: inquiry.preferred_location,
      message: inquiry.message,
      status: inquiry.status,
      priority: inquiry.priority,
    });
    setShowEditModal(true);
  };

  // Action handlers
  const updateInquiryStatus = async (
    id: string,
    newStatus: string
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === id
            ? {
                ...inquiry,
                status: newStatus as Inquiry["status"],
                updated_at: new Date().toISOString(),
              }
            : inquiry
        )
      );

      loadStats();
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    }
  };

  const updateInquiry = async () => {
    if (!editingInquiry) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("inquiries")
        .update({
          ...editForm,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingInquiry.id);

      if (error) throw error;

      // Update local state
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === editingInquiry.id
            ? { ...inquiry, ...editForm, updated_at: new Date().toISOString() }
            : inquiry
        )
      );

      setShowEditModal(false);
      setEditingInquiry(null);
      loadStats(); // Refresh stats if status/priority changed
    } catch (error) {
      console.error("Error updating inquiry:", error);
      alert("Failed to update inquiry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInquiry = async (id: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;

      setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== id));
      loadStats();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  // Utility functions
  const getDateString = (daysAgo: number): string => {
    const date = new Date();
    if (daysAgo === 0) {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setDate(date.getDate() - daysAgo);
    }
    return date.toISOString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus =
      filters.status === "all" || inquiry.status === filters.status;
    const matchesPriority =
      filters.priority === "all" || inquiry.priority === filters.priority;
    return matchesStatus && matchesPriority;
  });

  // Effects
  useEffect(() => {
    loadInquiries();
    loadStats();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (filters.search) {
        searchInquiries(filters.search);
      } else {
        loadInquiries();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [filters.search]);

  useEffect(() => {
    const subscription = supabase
      .channel("inquiries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inquiries" },
        () => {
          loadInquiries();
          loadStats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Render guards
  if (loading) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left - Title and Welcome */}
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Inquiries Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Welcome, {session.user.email} – Manage property inquiries and
                leads
              </p>
            </div>

            {/* Middle - Last Updated and Spinner */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Last updated: {formatDate(new Date().toISOString())}</span>
              {isLoading && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Right side: Admin button above Logout button */}
            <div className="flex flex-col  sm:items-center sm:gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/properties")}
                className="  px-4 py-2 rounded hover:bg-gray-300"
              >
                Admin Properties
              </Button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-fit"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Inquiries",
              value: stats.total_inquiries,
              icon: Users,
              color: "text-blue-600",
              subtitle: `+${stats.month_inquiries} this month`,
            },
            {
              title: "New Inquiries",
              value: stats.new_inquiries,
              icon: AlertCircle,
              color: "text-blue-600",
              subtitle: `+${stats.today_inquiries} today`,
            },
            {
              title: "Contacted",
              value: stats.contacted_inquiries,
              icon: CheckCircle,
              color: "text-yellow-600",
              subtitle: `+${stats.week_inquiries} this week`,
            },
            {
              title: "Closed",
              value: stats.closed_inquiries,
              icon: Clock,
              color: "text-gray-600",
              subtitle: "",
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      stat.color === "text-blue-600" && index === 0
                        ? "text-gray-900"
                        : stat.color
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              {stat.subtitle && (
                <p className="text-sm text-gray-500 mt-2">{stat.subtitle}</p>
              )}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search inquiries by first name, last name, email or preferred location..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="text-gray-600 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.status ?? "all"}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="text-gray-600 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filters.priority ?? "all"}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="text-gray-600 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Contact",
                    "Details",
                    "Status",
                    "Priority",
                    "Date",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.first_name} {inquiry.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {inquiry.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {inquiry.preferred_location}
                        </div>
                        <div className="text-gray-600">
                          Budget: {inquiry.budget_range}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.status}
                        onChange={(e) =>
                          updateInquiryStatus(inquiry.id, e.target.value)
                        }
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${
                          statusColors[inquiry.status]
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          priorityColors[inquiry.priority]
                        }`}
                      >
                        {inquiry.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(inquiry.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {[
                          {
                            icon: Eye,
                            onClick: () => setSelectedInquiry(inquiry),
                            color: "text-blue-600 hover:text-blue-900",
                            title: "View Details",
                          },
                          {
                            icon: Mail,
                            onClick: () => handleEmailAction(inquiry),
                            color: "text-green-600 hover:text-green-900",
                            title: "Send Email",
                          },
                          {
                            icon: Edit,
                            onClick: () => handleEditAction(inquiry),
                            color: "text-gray-600 hover:text-gray-900",
                            title: "Edit",
                          },
                          {
                            icon: Trash2,
                            onClick: () => deleteInquiry(inquiry.id),
                            color: "text-red-600 hover:text-red-900",
                            title: "Delete",
                          },
                        ].map((action, index) => (
                          <button
                            key={index}
                            onClick={action.onClick}
                            className={action.color}
                            title={action.title}
                          >
                            <action.icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredInquiries.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No inquiries found</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Inquiry Details
                  </h2>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Name",
                        value: `${selectedInquiry.first_name} ${selectedInquiry.last_name}`,
                      },
                      { label: "Email", value: selectedInquiry.email },
                      {
                        label: "Budget Range",
                        value: selectedInquiry.budget_range,
                      },
                      {
                        label: "Preferred Location",
                        value: selectedInquiry.preferred_location,
                      },
                    ].map((field, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <p className="text-gray-900">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedInquiry.message}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[selectedInquiry.status]
                        }`}
                      >
                        {selectedInquiry.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          priorityColors[selectedInquiry.priority]
                        }`}
                      >
                        {selectedInquiry.priority}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created
                      </label>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedInquiry.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* EMAIL MODAL */}
      {showEmailModal && emailRecipient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Send Email to {emailRecipient.first_name}{" "}
                  {emailRecipient.last_name}
                </h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Template
                  </label>
                  <select
                    value={emailData.template}
                    onChange={(e) =>
                      handleTemplateChange(e.target.value as TemplateKey)
                    }
                    className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="initial_contact">Initial Contact</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="custom">Custom Message</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To: {emailRecipient.email}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailData.message}
                    onChange={(e) =>
                      setEmailData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    rows={8}
                    className="w-full   text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmail}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  {isLoading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* EDIT MODAL */}
      {showEditModal && editingInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Inquiry
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.first_name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.last_name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                      className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <input
                      type="text"
                      value={editForm.budget_range}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          budget_range: e.target.value,
                        }))
                      }
                      className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      value={editForm.preferred_location}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          preferred_location: e.target.value,
                        }))
                      }
                      className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={editForm.message}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          status: e.target.value as Inquiry["status"],
                        }))
                      }
                      className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={editForm.priority}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          priority: e.target.value as Inquiry["priority"],
                        }))
                      }
                      className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={updateInquiry}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Edit className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
