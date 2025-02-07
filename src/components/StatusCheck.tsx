import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function StatusCheck() {
  const [trackingId, setTrackingId] = useState('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement status check
  };

  return (
    <div className="rounded-lg bg-gray-50 p-6">
      <h2 className="text-lg font-medium text-gray-900">Check Request Status</h2>
      <form onSubmit={handleCheck} className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Search className="mr-2 h-4 w-4" />
            Check Status
          </button>
        </div>
      </form>
    </div>
  );
}