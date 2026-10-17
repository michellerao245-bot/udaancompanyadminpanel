import React from 'react';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrderTable({ orders, onStatusChange }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-5xl mb-3">📋</p>
        <p className="font-medium">No orders yet</p>
        <p className="text-sm">Orders from salesmen will appear here</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Order #
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Retailer
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
              Qty
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
              Amount
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono text-gray-600">
                {order.order_number}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800">
                {order.product_name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {order.retailer_name}
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-800">
                {order.quantity}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-marico-blue">
                ₹{Number(order.amount).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    statusColors[order.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => onStatusChange(order.id, 'CONFIRMED')}
                    className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded font-medium"
                  >
                    Confirm
                  </button>
                )}
                {order.status === 'CONFIRMED' && (
                  <button
                    onClick={() => onStatusChange(order.id, 'DELIVERED')}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded font-medium"
                  >
                    Deliver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}