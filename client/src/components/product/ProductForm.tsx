import React from "react";
import { useForm } from "react-hook-form";
import { CreateProductData } from "../../api/product";
import Button from "../common/Button";

interface ProductFormProps {
  initialData?: Partial<CreateProductData>;
  onSubmit: (data: CreateProductData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductData>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Image URL *
        </label>
        <input
          {...register("imageUrl", { required: "Image URL is required" })}
          id="imageUrl"
          type="url"
          className="input"
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
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
