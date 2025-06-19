"use client";
import { useProperty } from "@/lib/hooks/useProperties";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const { property, loading, error } = useProperty(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <PropertyDetails property={property} />
    </div>
  );
}
