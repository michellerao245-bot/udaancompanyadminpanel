import React from 'react';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-5xl mb-3">📦</p>
        <p className="font-medium">No products yet</p>
        <p className="text-sm">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Category
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
              MRP
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
              Rate
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
              Stock
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="font-semibold text-gray-800 text-sm">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">{product.unit}</p>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {product.category}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">
                ₹{Number(product.mrp).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-marico-blue">
                ₹{Number(product.rate).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    product.stock < 50
                      ? 'bg-red-100 text-red-700'
                      : product.stock < 100
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}