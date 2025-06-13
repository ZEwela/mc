"use client";
import { useProperty } from "@/lib/hooks/useProperties";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { notFound } from "next/navigation";

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { property, loading, error } = useProperty(params.id);

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
