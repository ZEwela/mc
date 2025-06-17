import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";

const schema = z.object({
  property_id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.number().min(1),
  current_address: z.string().min(1),
  postcode: z.string().min(1),
  buying_status: z.string().min(1),
  funding_option: z.string().min(1),
  heard_about: z.string().min(1),
  subscribe_newsletter: z.boolean().optional(),
  accepted_terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms." }),
  }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  propertyAddress?: string;
}

export default function RequestViewingModal({
  isOpen,
  onClose,
  propertyTitle,
  propertyAddress,
  propertyId,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("request_viewings").insert([data]);
    if (!error) {
      alert("Submitted!");
      reset();
      onClose();
    } else {
      alert("Error submitting form.");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-lg relative overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 lg:p-8 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-black text-2xl hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
            aria-label="Close modal"
          >
            ×
          </button>

          <h2 className="uppercase text-xs sm:text-sm tracking-wide text-gray-600">
            Request a viewing of
          </h2>
          <h3 className="text-xl sm:text-2xl font-semibold mt-1 pr-8  text-gray-600">
            {propertyTitle}
          </h3>
          <p className="text-base sm:text-lg text-gray-700 mt-1">
            {propertyAddress}
          </p>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <input
              type="hidden"
              value={propertyId}
              {...register("property_id")}
            />

            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  First name *
                </label>
                <input
                  {...register("first_name")}
                  className=" text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Last name *
                </label>
                <input
                  {...register("last_name")}
                  className=" text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email address *
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className=" text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone number *
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="  text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Address *
                </label>
                <input
                  {...register("current_address")}
                  className="  text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
                {errors.current_address && (
                  <p className="text-red-500 text-sm">
                    {errors.current_address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Postcode *
                </label>
                <input
                  {...register("postcode")}
                  className=" text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
                {errors.postcode && (
                  <p className="text-red-500 text-sm">
                    {errors.postcode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buying Information - Stack on mobile, side by side on larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What is your buying status? *
                </label>
                <select
                  {...register("buying_status")}
                  className=" text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white"
                >
                  <option value="">Please select...</option>
                  <option>First time buyer</option>
                  <option>Chain free</option>
                  <option>Current home under offer</option>
                  <option>Current home on the market</option>
                  <option>Current home not yet on the market</option>
                  <option>Investor</option>
                  <option>Buying second home</option>
                </select>
                {errors.buying_status && (
                  <p className="text-red-500 text-sm">
                    {errors.buying_status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What are your funding options? *
                </label>
                <select
                  {...register("funding_option")}
                  className=" text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white"
                >
                  <option value="">Please select...</option>
                  <option>Cash</option>
                  <option>Mortgage agreed</option>
                  <option>Need mortgage</option>
                  <option>Other</option>
                </select>
                {errors.funding_option && (
                  <p className="text-red-500 text-sm">
                    {errors.funding_option.message}
                  </p>
                )}
              </div>
            </div>

            {/* Marketing Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Where did you first hear about us? *
              </label>
              <select
                {...register("heard_about")}
                className=" text-gray-600 w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white"
              >
                <option value="">Please select...</option>
                <option>Social media</option>
                <option>Posted Leaflet</option>
                <option>Google Search</option>
                <option>From another company</option>
                <option>Previous client</option>
                <option>For Sale board</option>
                <option>Online press</option>
                <option>Recommendation</option>
                <option>Long term follower</option>
                <option>Rightmove or Zoopla</option>
                <option>Event</option>
              </select>
              {errors.heard_about && (
                <p className="text-red-500 text-sm">
                  {errors.heard_about.message}
                </p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register("subscribe_newsletter")}
                  className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label className="text-sm text-gray-700 leading-5">
                  I&apos;d like to subscribe to the newsletter
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register("accepted_terms")}
                  className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label className="text-sm text-gray-700 leading-5">
                  I accept the{" "}
                  <a
                    href="#"
                    className="underline hover:text-black transition-colors"
                  >
                    Privacy & Cookies Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="underline hover:text-black transition-colors"
                  >
                    Terms & Conditions
                  </a>{" "}
                  *
                </label>
              </div>

              {errors.accepted_terms && (
                <p className="text-red-500 text-sm">
                  {errors.accepted_terms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-md uppercase tracking-wide font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
