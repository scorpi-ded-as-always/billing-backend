import React, { useState } from "react";

const API_BASE = "https://billing-frontend-nk45.onrender.com"; // 🔁 Replace this

const ProductForm = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
        }),
      });

      if (res.ok) {
        alert("Product added!");
        setProduct({ id: "", name: "", price: "", stock: "" });
        if (onProductAdded) onProductAdded(); // refresh list
      } else {
        alert("Error adding product");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="id"
        value={product.id}
        placeholder="Product ID"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="name"
        value={product.name}
        placeholder="Product Name"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="price"
        value={product.price}
        placeholder="Price"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="stock"
        value={product.stock}
        placeholder="Stock"
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ➕ Add Product
      </button>
    </form>
  );
};

export default ProductForm;
