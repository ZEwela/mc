import PropertyEditForm from "@/components/properties/PropertyEditForm";

interface PropertyEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPropertyPage({
  params,
}: PropertyEditPageProps) {
  const { id } = await params;
  return <PropertyEditForm propertyId={id} />;
}
