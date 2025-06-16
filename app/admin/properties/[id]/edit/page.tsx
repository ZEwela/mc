import PropertyEditForm from "@/components/properties/PropertyEditForm";

interface PropertyEditPageProps {
  params: {
    id: string;
  };
}

export default function EditPropertyPage({ params }: PropertyEditPageProps) {
  return <PropertyEditForm propertyId={params.id} />;
}
