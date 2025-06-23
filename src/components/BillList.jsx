import React, { useEffect, useState } from "react";

const API_BASE = "https://billing-frontend-nk45.onrender.com/"; // 🔁 Replace this

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/bills`)
      .then((res) => res.json())
      .then(setBills);

    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const downloadPDF = (billId) => {
    fetch(`${API_BASE}/download-pdf/${billId}`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${billId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };

  const getProductName = (id) => {
    const product = products.find((p) => p.id === id);
    return product ? product.name : "Unknown";
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-2">📋 Previous Bills</h2>
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="border border-gray-300 rounded p-4 shadow"
            >
              <p className="font-semibold">🧾 Bill ID: {bill.id}</p>
              <ul className="list-disc pl-5">
                {bill.items.map((item, idx) => (
                  <li key={idx}>
                    {getProductName(item.productId)} - Qty: {item.quantity} - ₹
                    {item.price}
                  </li>
                ))}
              </ul>
              <p>Total: ₹{bill.total}</p>
              {bill.gst > 0 && <p>GST: ₹{(bill.total * bill.gst) / 100}</p>}
              {bill.discount > 0 && (
                <p>Discount: ₹{(bill.total * bill.discount) / 100}</p>
              )}
              <p className="font-bold">Final Amount: ₹{bill.finalAmount}</p>

              <button
                className="mt-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                onClick={() => downloadPDF(bill.id)}
              >
                📥 Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillList;
