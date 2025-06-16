"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase/client";
import { locations, propertyTypes } from "@/types/property";
import Image from "next/image";

export default function AddPropertyForm() {
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

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;

    // Check if the input is a checkbox
    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";
    const checked = isCheckbox ? target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadImagesToSupabase = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of images) {
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
      const imageUrls = await uploadImagesToSupabase();

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          square_feet: parseInt(formData.square_feet),
          year_built: parseInt(formData.year_built),
          images: imageUrls,
        }),
      });

      if (!res.ok) throw new Error("Failed to create property");

      router.push("/properties");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Add New Property
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="title"
              placeholder="Title"
              required
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800"
              value={formData.title}
              onChange={handleChange}
            />
            <select
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <input
              name="price"
              type="number"
              placeholder="Price (£)"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-600"
              value={formData.price}
              onChange={handleChange}
            />
            <select
              name="property_type"
              value={formData.property_type || ""}
              onChange={handleChange}
              className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select property type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              name="bedrooms"
              type="number"
              min="0"
              placeholder="Bedrooms"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800"
              value={formData.bedrooms}
              onChange={handleChange}
            />
            <input
              name="bathrooms"
              type="number"
              min="0"
              placeholder="Bathrooms"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800"
              value={formData.bathrooms}
              onChange={handleChange}
            />
            <input
              name="square_feet"
              type="number"
              placeholder="Square Feet"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800"
              value={formData.square_feet}
              onChange={handleChange}
            />
            <input
              name="year_built"
              type="number"
              placeholder="Year Built"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800"
              value={formData.year_built}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800"
            value={formData.description}
            onChange={handleChange}
          />

          <div>
            <label
              htmlFor="image-upload"
              className="block font-medium mb-2 text-gray-800"
            >
              Images{" "}
              <span className="text-sm text-gray-500">
                (Click below to choose)
              </span>
            </label>

            <label
              htmlFor="image-upload"
              className="cursor-pointer block w-full px-4 py-2 border-2 border-dashed border-gray-300 text-center text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition"
            >
              📁 Click to choose images
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <Image
                      width={200}
                      height={200}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx}`}
                      className="w-full h-32 object-cover rounded-lg shadow border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-90 hover:opacity-100 transition"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center text-gray-800">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2"
              />
              Featured
            </label>

            <select
              name="status"
              className="border border-gray-300 rounded px-4 py-2 text-gray-800"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Property"}
          </button>
        </form>
      </div>
    </div>
  );
}
