import React, { useEffect, useState } from "react";

const API_BASE = "https://billing-frontend-nk45.onrender.com/"; // 🔁 Replace this

const App = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🧾 Billing System</h1>
      <h2 className="text-xl mb-2">Available Products</h2>
      <ul className="list-disc pl-5">
        {products.length > 0 ? (
          products.map((p) => (
            <li key={p.id}>
              {p.name} - ₹{p.price} (Stock: {p.stock})
            </li>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
