"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// ---------- Types ----------
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  budgetRange: string;
  preferredLocation: string;
  message: string;
}
interface SubmissionResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

type FormField = keyof FormData;

type FormErrors = Partial<Record<FormField, string>>;

type SubmitStatus =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

// ---------- Validators ----------
const inquirySchema: Record<FormField, (value: string) => string | null> = {
  firstName: (value) =>
    !value || value.trim().length < 2
      ? "First name must be at least 2 characters"
      : null,
  lastName: (value) =>
    !value || value.trim().length < 2
      ? "Last name must be at least 2 characters"
      : null,
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !value || !emailRegex.test(value)
      ? "Please enter a valid email address"
      : null;
  },
  budgetRange: (value) =>
    !value || value.trim() === "" ? "Please specify your budget range" : null,
  preferredLocation: (value) =>
    !value || value.trim() === ""
      ? "Please specify your preferred location"
      : null,
  message: (value) =>
    !value || value.trim().length < 10
      ? "Please provide more details (at least 10 characters)"
      : null,
};

// ---------- Component ----------
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    budgetRange: "",
    preferredLocation: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const validateField = (name: FormField, value: string) =>
    inquirySchema[name](value);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as FormField[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleInputChange = (field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInquirySubmission = async (
    formData: FormData
  ): Promise<SubmissionResult> => {
    try {
      const { data, error } = await supabase.from("inquiries").insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          budget_range: formData.budgetRange,
          preferred_location: formData.preferredLocation,
          message: formData.message,
          status: "new",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Supabase Error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: unknown) {
      console.error("Unexpected Error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      };
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const result = await handleInquirySubmission(formData);

    if (result.success) {
      setSubmitStatus({
        type: "success",
        message: "Thank you! Your inquiry has been submitted successfully.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        budgetRange: "",
        preferredLocation: "",
        message: "",
      });
    } else {
      setSubmitStatus({
        type: "error",
        message:
          "Sorry, there was an error submitting your inquiry. Please try again.",
      });
    }

    setIsSubmitting(false);
  };

  // contact info (unchanged)
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "EMAIL",
      value: "sales@montcervin.co.uk",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "PHONE",
      value: "+44 20 1234 5678",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "OFFICE",
      value: "London, United Kingdom",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1EC] p-10 lg:p-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-40">
          {/* Form Section */}
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Begin Your Search
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Ready to find your perfect Nordic retreat? Get in touch to discuss
              your requirements and arrange exclusive property viewings.
            </p>

            {submitStatus && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                {submitStatus.message}
              </div>
            )}

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`text-black w-full px-0 py-3 border-0 border-b-2 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 transition-colors ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-gray-300 focus:border-gray-900"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`text-black w-full px-0 py-3 border-0 border-b-2 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 transition-colors ${
                      errors.lastName
                        ? "border-red-500"
                        : "border-gray-300 focus:border-gray-900"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`text-black w-full px-0 py-3 border-0 border-b-2 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 transition-colors ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 focus:border-gray-900"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Budget Range */}
              <div>
                <input
                  type="text"
                  placeholder="Budget Range"
                  value={formData.budgetRange}
                  onChange={(e) =>
                    handleInputChange("budgetRange", e.target.value)
                  }
                  className={`text-black w-full px-0 py-3 border-0 border-b-2 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 transition-colors ${
                    errors.budgetRange
                      ? "border-red-500"
                      : "border-gray-300 focus:border-gray-900"
                  }`}
                />
                {errors.budgetRange && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.budgetRange}
                  </p>
                )}
              </div>

              {/* Preferred Location */}
              <div>
                <input
                  type="text"
                  placeholder="Preferred Location"
                  value={formData.preferredLocation}
                  onChange={(e) =>
                    handleInputChange("preferredLocation", e.target.value)
                  }
                  className={`text-black w-full px-0 py-3 border-0 border-b-2 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 transition-colors ${
                    errors.preferredLocation
                      ? "border-red-500"
                      : "border-gray-300 focus:border-gray-900"
                  }`}
                />
                {errors.preferredLocation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.preferredLocation}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <textarea
                  placeholder="Tell us about your ideal property..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`text-black w-full px-0 py-3 border-0 border-b-2 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 resize-none transition-colors ${
                    errors.message
                      ? "border-red-500"
                      : "border-gray-300 focus:border-gray-900"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Start Property Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="lg:pl-8">
            <div className="space-y-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-gray-700 mt-1">{item.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {item.label}
                    </p>
                    <p className="text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Hours */}
            <div className="mt-12">
              <div className="flex items-start gap-4">
                <div className="text-gray-700 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-3">
                    OFFICE HOURS
                  </p>
                  <div className="space-y-1 text-gray-900">
                    <p>Monday - Friday: 9:00 - 18:00</p>
                    <p>Saturday: 10:00 - 16:00</p>
                    <p>Sunday: By appointment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
