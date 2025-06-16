import React from "react";
import { Bell, MapPin, Car, Coffee, Waves, Wifi } from "lucide-react";

const ServicesPage = () => {
  const services = [
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Property Sourcing",
      description:
        "We identify and evaluate exceptional properties before they reach the open market",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location Analysis",
      description:
        "Comprehensive area assessments including transport links and local amenities",
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Private Viewings",
      description:
        "Exclusive access to properties with personalised viewing arrangements",
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Investment Guidance",
      description:
        "Expert advice on property value, rental potential, and market trends",
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Renovation Support",
      description:
        "Connect with trusted architects and contractors for property enhancement",
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Purchase Assistance",
      description:
        "Full support through surveys, legal processes, and completion",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1EC] p-10 lg:p-20">
      {/* Header Section */}
      <div className="mb-16 flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
          Buyer Services
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          Our comprehensive service ensures a seamless property acquisition
          experience from initial search to final completion.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 lg:m-20">
        {services.map((service, index) => (
          <div key={index} className="group">
            {/* Icon */}
            <div className="mb-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
              {service.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
          Ready to Start Your Property Journey?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Our expert team is here to guide you through every step of the
          property acquisition process.
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">
          Get Started Today
        </button>
      </div>
    </div>
  );
};

export default ServicesPage;
