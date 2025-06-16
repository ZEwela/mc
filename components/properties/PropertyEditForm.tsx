"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase/client";
import { locations, propertyTypes } from "@/types/property";
import Image from "next/image";
import { ArrowLeft, Upload, Save, X } from "lucide-react";

interface PropertyEditFormProps {
  propertyId: string;
}

export default function PropertyEditForm({
  propertyId,
}: PropertyEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    year_built: "",
    status: "available",
    featured: false,
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProperty, setFetchingProperty] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    setFetchingProperty(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          location: data.location || "",
          property_type: data.property_type || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          square_feet: data.square_feet?.toString() || "",
          year_built: data.year_built?.toString() || "",
          status: data.status || "available",
          featured: data.featured || false,
        });
        setExistingImages(data.images || []);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to fetch property details");
    } finally {
      setFetchingProperty(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;

    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";
    const checked = isCheckbox ? target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const uploadNewImagesToSupabase = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of newImages) {
      const fileName = `${uuidv4()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (uploadError) {
        console.log(uploadError);
        throw new Error(`Failed to upload ${file.name}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload new images
      const newImageUrls = await uploadNewImagesToSupabase();

      // Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];

      const updateData = {
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        location: formData.location,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        square_feet: formData.square_feet
          ? parseInt(formData.square_feet)
          : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        status: formData.status,
        featured: formData.featured,
        images: allImages,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("properties")
        .update(updateData)
        .eq("id", propertyId);

      if (error) {
        throw new Error(error.message);
      }

      router.push("/admin/properties");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProperty) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/properties")}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Properties
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Edit Property</h2>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                name="title"
                placeholder="Enter property title"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (£)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                name="property_type"
                required
                value={formData.property_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="">Select property type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                name="bedrooms"
                type="number"
                min="0"
                placeholder="Number of bedrooms"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                name="bathrooms"
                type="number"
                min="0"
                placeholder="Number of bathrooms"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Feet
              </label>
              <input
                name="square_feet"
                type="number"
                min="0"
                placeholder="Total square footage"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.square_feet}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Built
              </label>
              <input
                name="year_built"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                placeholder="Year property was built"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.year_built}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Enter property description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Property Images
            </label>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Current Images
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((imageUrl, idx) => (
                    <div key={idx} className="relative group">
                      <Image
                        width={200}
                        height={200}
                        src={imageUrl}
                        alt={`Property image ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Add New Images
              </h4>
              <label
                htmlFor="new-image-upload"
                className="cursor-pointer flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 text-center text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="font-medium">Click to add new images</span>
                  <span className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB each
                  </span>
                </div>
                <input
                  id="new-image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewFileChange}
                  className="hidden"
                />
              </label>

              {/* New Images Preview */}
              {newImages.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-600 mb-3">
                    New Images to Add
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {newImages.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <Image
                          width={200}
                          height={200}
                          src={URL.createObjectURL(file)}
                          alt={`New image ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status and Options */}
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-gray-700"
              >
                Featured Property
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {loading ? "Updating..." : "Update Property"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/properties")}
              className="flex items-center gap-2 bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
