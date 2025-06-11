export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatSquareFeet = (sqft: number): string => {
  return new Intl.NumberFormat("en-GB").format(sqft) + " sq ft";
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
