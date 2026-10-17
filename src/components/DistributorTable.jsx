import React from 'react';

export default function DistributorTable({
  distributors,
  onBlock,
  onDelete,
  onResetPassword,
}) {
  if (!distributors || distributors.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-5xl mb-3">🚚</p>
        <p className="font-medium">No distributors yet</p>
        <p className="text-sm">Add distributors to manage your supply chain</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              User ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Phone
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {distributors.map((dist) => (
            <tr key={dist.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono text-gray-800">
                {dist.user_id}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-800">
                {dist.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {dist.phone || '—'}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    dist.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {dist.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onBlock(dist.id)}
                    className="p-1.5 hover:bg-yellow-50 text-yellow-600 rounded text-xs"
                    title={dist.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                  >
                    {dist.status === 'ACTIVE' ? '🚫' : '✅'}
                  </button>
                  <button
                    onClick={() => onResetPassword(dist.id)}
                    className="p-1.5 hover:bg-blue-50 text-blue-600 rounded text-xs"
                    title="Reset Password"
                  >
                    🔑
                  </button>
                  <button
                    onClick={() => onDelete(dist.id)}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded text-xs"
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