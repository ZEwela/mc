import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils/format";
import type { Property } from "@/types/property";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
  tallImage?: boolean;
}

export function PropertyCard({
  property,
  tallImage = false,
}: PropertyCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fallbackImage = "/assets/lisa-anna-9Vsd3kJqZXI-unsplash.jpg";
  const mainImage = property.images?.[0] || fallbackImage;
  const hoverImage = property.images?.[1] || fallbackImage;

  return (
    <Link
      href={`/properties/${property.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        className={`flex flex-col bg-[#F5F1EC] overflow-hidden border-0 shadow-none transition-shadow duration-300 rounded-none ${
          tallImage ? "h-[480px]" : "h-[420px]"
        }`}
      >
        <div className={`relative ${tallImage ? "h-80" : "h-64"} shrink-0`}>
          <Image
            src={imgError ? fallbackImage : hovered ? hoverImage : mainImage}
            alt={property.title}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
          {property.featured && (
            <div className="absolute top-4 left-4 bg-gray-900/50 text-white px-3 py-1 rounded text-sm font-medium">
              Featured
            </div>
          )}
        </div>

        <CardContent className=" flex flex-col flex-grow py-6 px-1">
          <div className="mt-auto">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-md font-light text-gray-900 line-clamp-2">
                {property.title}
              </h3>
              {property.price && (
                <p className="text-md font-semibold text-gray-900 ml-4">
                  {formatPrice(property.price)}
                </p>
              )}
            </div>

            {property.location && (
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>
                    {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>
                    {property.bathrooms} bath
                    {property.bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {property.square_feet && (
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.square_feet.toLocaleString()} sq ft</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
