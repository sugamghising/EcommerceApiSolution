import React, { useEffect, useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import ProductList from "../components/product/ProductList";
import { useDebounce } from "../hooks/useDebounce";

const ProductPage: React.FC = () => {
  const {
    products,
    loading,
    fetchProducts,
    totalPages,
    categories,
    fetchCategories,
  } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchCategories();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filters: any = { page, limit: 12 };
    if (debouncedSearch) filters.search = debouncedSearch;
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

    fetchProducts(filters);
    // fetchProducts is stable from context
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category, minPrice, maxPrice, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">All Products</h1>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              placeholder="Search products..."
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min Price
            </label>
            <input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input"
              placeholder="$0"
              min="0"
            />
          </div>
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max Price
            </label>
            <input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input"
              placeholder="$999+"
              min="0"
            />
          </div>
        </div>
        <button
          onClick={() => {
            setSearch("");
            setCategory("");
            setMinPrice("");
            setMaxPrice("");
            setPage(1);
          }}
          className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Clear Filters
        </button>
      </div>

      {/* Product Grid */}
      <ProductList products={products} loading={loading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-4 py-2 border rounded-lg ${
                p === page ? "bg-primary-600 text-white" : "hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
