"use client";
import { PropertyGallery } from "./PropertyGallery";
import { formatPrice } from "@/lib/utils/format";
import type { Property } from "@/types/property";
import { Bed, Bath, Square, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import RequestViewingModal from "../common/RequestViewingModal";
import Link from "next/link";
import { TearEffect } from "../common/TearEffect";
import { FeaturedProperties } from "./FeaturedProperties";

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [isRequestViewingModalOpen, setIsRequestViewingModalOpen] =
    useState(false);
  const firstImage = property.images?.[0] ?? null;

  const body = `Hi,%0D%0AI'm interested in property ${property.id}.%0D%0APlease let me know availability.`;
  const topContent = (
    <div className="max-w-5xl mx-auto  md:p-30 bg-cover bg-center text-white flex flex-col justify-center items-center p-8">
      <p className="text-lg">Interested? Let&apos;s talk.</p>
      <div className="flex gap-10 p-10 flex-col  justify-center  items-center text-sm md:flex-row">
        <Link
          href="tel:+442012345678"
          className=" hover:underline  underline-offset-6"
        >
          +44 20 1234 5678
        </Link>
        <a
          className="hover:underline  underline-offset-6 uppercase text-sm"
          href={`mailto:sales@yourdomain.com?subject=${encodeURIComponent(
            `Viewing Request: ${property.id}`
          )}&body=${body}`}
        >
          Email us
        </a>
        <div
          className="hover:underline  underline-offset-6 "
          onClick={() => setIsRequestViewingModalOpen(true)}
        >
          <div className="uppercase text-sm hover:cursor-pointer">
            Request Viewing
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="bg-[#F5F1EC]">
      <section className="relative min-h-[500px] h-[80vh]  flex flex-col lg:flex-row ">
        {/* Left side: Background image */}

        <div
          className="md:flex-[0_0_70%] h-[75vh] lg:h-auto bg-cover bg-center relative group"
          style={{
            backgroundImage: firstImage
              ? `url(${firstImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {/* More Photos Button */}
          {property.images && property.images.length > 1 && (
            <Button
              variant="outline"
              className=" text-xs font-light absolute bottom-4 right-4 bg-white border-none  hover:bg-opacity-100 text-black   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => setShowGallery(true)}
            >
              MORE PHOTOS
            </Button>
          )}

          {/* Gallery Fullscreen */}
          {showGallery && (
            <div className="md:flex-[0_0_70%] h-[75vh] lg:h-auto bg-cover bg-center relative group">
              <PropertyGallery
                images={property.images || []}
                title={property.title}
                showLightBox={showGallery}
                setShowGallery={setShowGallery}
              />
            </div>
          )}
        </div>

        {/* Right side: content box */}
        <div className="md:flex-[0_0_30%] flex flex-col justify-center p-6 bg-[#F5F1EC] text-black text-center lg:text-left">
          <div className="flex flex-col  items-start mt-5  gap-6 mb-3 lg:mx-7 h-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {property.title}
              </h1>
              {property.location && (
                <div className="flex items-center text-gray-900 mb-4">
                  <span className="text-md">{property.location}</span>
                </div>
              )}
              {property.price && (
                <div className="text-sm pb-3 text-left">
                  {" "}
                  {formatPrice(property.price)}
                </div>
              )}
            </div>
            <div className="flex flex-col w-full space-y-4 justify-center  lg:justify-start ">
              <Button
                size="sm"
                onClick={() => setIsRequestViewingModalOpen(true)}
              >
                <div className="uppercase">Request Viewing</div>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {isRequestViewingModalOpen && (
        <RequestViewingModal
          isOpen={isRequestViewingModalOpen}
          onClose={() => setIsRequestViewingModalOpen(false)}
          propertyId={property.id}
          propertyTitle={property.title}
          propertyAddress={property.location}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 py-4 bg-[#F5F1EC]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Property Info */}
            <div className="mt-4 px-8">
              {/* Description */}
              {property.description && (
                <div className="mb-8 py-4">
                  <h2 className="text-xl font-mono text-center text-gray-900 mb-10">
                    About this property
                  </h2>
                  {/* Key Features */}
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-6 mb-8 p ">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-gray-600 text-sm font-medium">
                          {property.bedrooms}
                        </span>
                        <span className="text-gray-600 ml-1">
                          bedroom{property.bedrooms !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-gray-600 text-sm font-medium">
                          {property.bathrooms}
                        </span>
                        <span className="text-gray-600 ml-1">
                          bathroom{property.bathrooms !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    {property.square_feet && (
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-gray-600 text-sm font-medium">
                          {property.square_feet.toLocaleString()}
                        </span>
                        <span className="text-gray-600 ml-1">sq ft</span>
                      </div>
                    )}
                    {property.property_type && (
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-gray-600 text-sm font-medium">
                          {property.property_type}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className=" max-w-none py-10">
                    <p className="text-gray-700 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <TearEffect
        topContent={topContent}
        topColor={"black"}
        bottomColor={"#F5F1EC"}
        bottomContent={<FeaturedProperties />}
      />
    </div>
  );
}
