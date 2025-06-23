import React, { useState, useEffect } from "react";

const API_BASE = "https://billing-frontend-nk45.onrender.com/"; // 🔁 Replace this

const BillForm = ({ onBillAdded }) => {
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [gst, setGst] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const addItem = () => {
    setBillItems([...billItems, { productId: "", quantity: 1, price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...billItems];
    updatedItems[index][field] = field === "quantity" ? parseInt(value) : value;

    // Auto update price based on selected product
    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      if (product) updatedItems[index].price = product.price;
    }

    setBillItems(updatedItems);
  };

  const calculateTotal = () => {
    const subtotal = billItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const gstAmount = (subtotal * gst) / 100;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + gstAmount - discountAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = billItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const finalAmount = calculateTotal();

    const bill = {
      id: Date.now().toString(),
      items: billItems,
      total,
      gst,
      discount,
      finalAmount,
    };

    try {
      const res = await fetch(`${API_BASE}/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill),
      });

      if (res.ok) {
        alert("Bill created!");
        setBillItems([]);
        setGst(0);
        setDiscount(0);
        if (onBillAdded) onBillAdded();
      } else {
        alert("Error creating bill");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">🧾 Create Bill</h2>

      {billItems.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <select
            value={item.productId}
            onChange={(e) => updateItem(idx, "productId", e.target.value)}
            className="border p-2 w-1/3"
            required
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateItem(idx, "quantity", e.target.value)}
            className="border p-2 w-1/3"
            placeholder="Qty"
            min="1"
            required
          />
          <input
            type="number"
            value={item.price}
            readOnly
            className="border p-2 w-1/3"
            placeholder="Price"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        ➕ Add Item
      </button>

      <div className="flex gap-4">
        <input
          type="number"
          placeholder="GST %"
          value={gst}
          onChange={(e) => setGst(Number(e.target.value))}
          className="border p-2 w-1/2"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="border p-2 w-1/2"
        />
      </div>

      <p className="font-bold">💰 Final Amount: ₹{calculateTotal().toFixed(2)}</p>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ✅ Save Bill
      </button>
    </form>
  );
};

export default BillForm;
