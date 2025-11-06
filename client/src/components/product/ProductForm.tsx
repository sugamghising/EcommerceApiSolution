import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateProductData } from "../../api/product";
import Button from "../common/Button";

interface ProductFormProps {
  initialData?: Partial<CreateProductData>;
  onSubmit: (data: CreateProductData, imageFile?: File) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.imageUrl || ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductData>({
    defaultValues: initialData,
  });

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: CreateProductData) => {
    await onSubmit(data, imageFile || undefined);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Name *
        </label>
        <input
          {...register("name", { required: "Product name is required" })}
          id="name"
          type="text"
          className="input"
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description *
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          id="description"
          rows={4}
          className="input"
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price ($) *
          </label>
          <input
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
              valueAsNumber: true,
            })}
            id="price"
            type="number"
            step="0.01"
            className="input"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stock *
          </label>
          <input
            {...register("stock", {
              required: "Stock is required",
              min: { value: 0, message: "Stock must be positive" },
              valueAsNumber: true,
            })}
            id="stock"
            type="number"
            className="input"
            placeholder="0"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category *
        </label>
        <input
          {...register("category", { required: "Category is required" })}
          id="category"
          type="text"
          className="input"
          placeholder="e.g., Electronics, Clothing, Books"
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Image {!initialData && "*"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            cursor-pointer"
        />
        <p className="mt-1 text-xs text-gray-500">
          Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
        </p>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
          </div>
        )}
      </div>

      {/* Optional: Still allow URL input as fallback */}
      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Or Image URL (Optional)
        </label>
        <input
          {...register("imageUrl")}
          id="imageUrl"
          type="url"
          className="input"
          placeholder="https://example.com/image.jpg"
        />
        <p className="mt-1 text-xs text-gray-500">
          If no file is uploaded, you can provide an image URL
        </p>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {initialData ? "Update Product" : "Create Product"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
