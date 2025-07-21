import React from 'react';
import { formatCurrency, formatDate, getBidStatusColor } from './utils';

const BidsList = ({ bids }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Bids</h2>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bid Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{bid.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{bid.proposal}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bid.grant_title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bid.organization_name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    {formatCurrency(bid.requested_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBidStatusColor(bid.status)}`}>
                      {bid.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(bid.submitted_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bids.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No bids submitted yet.</div>
        </div>
      )}
    </div>
  );
};

export default BidsList;