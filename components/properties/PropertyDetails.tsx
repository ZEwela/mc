"use client";
import { PropertyGallery } from "./PropertyGallery";
import { formatPrice } from "@/lib/utils/format";
import type { Property } from "@/types/property";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Home,
  Star,
  Share2,
  Heart,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Gallery */}
          <PropertyGallery
            images={property.images || []}
            title={property.title}
          />

          {/* Property Info */}
          <div className="mt-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                {property.location && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap items-center gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-gray-600 font-medium">
                    {property.bedrooms}
                  </span>
                  <span className="text-gray-600 ml-1">
                    bedroom{property.bedrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-gray-600 font-medium">
                    {property.bathrooms}
                  </span>
                  <span className="text-gray-600 ml-1">
                    bathroom{property.bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {property.square_feet && (
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-gray-600 font-medium">
                    {property.square_feet.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-1">sq ft</span>
                </div>
              )}
              {property.property_type && (
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-gray-600 font-medium">
                    {property.property_type}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  About this property
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <h3 className="text-gray-600 text-xl font-semibold">
                  Property Details
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.created_at && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Listed on</span>
                      <span className="text-gray-600 ml-2 font-medium">
                        {new Date(property.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-gray-600 ml-2 font-medium capitalize">
                      {property.status}
                    </span>
                  </div>
                  {property.featured && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <span className="font-medium text-yellow-600">
                        Featured Property
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {/* Price & Contact */}
            <Card className="mb-6">
              <CardContent className="p-6">
                {property.price && (
                  <div className="text-3xl font-bold text-gray-900 mb-6">
                    {formatPrice(property.price)}
                  </div>
                )}

                <div className="space-y-3">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Enquiry
                  </Button>
                  <Button variant="outline" className="w-full">
                    Book Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
