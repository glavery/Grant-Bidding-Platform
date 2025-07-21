import React from 'react';
import { formatCurrency, formatDate, getGrantStatusColor } from './utils';

const GrantsList = ({ grants, onSelectGrant, organizations, onRefresh }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Grants</h2>
        <button
          onClick={onRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {grants.map((grant) => (
          <div key={grant.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{grant.title}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getGrantStatusColor(grant.status)}`}>
                {grant.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{grant.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Funding Amount:</span>
                <span className="font-semibold text-green-600">{formatCurrency(grant.funding_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Deadline:</span>
                <span className="font-medium">{formatDate(grant.application_deadline)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Posted by:</span>
                <span className="text-sm">{grant.created_by_name || 'Unknown'}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectGrant(grant)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              disabled={grant.status !== 'open'}
            >
              {grant.status === 'open' ? 'Apply for Grant' : 'View Details'}
            </button>
          </div>
        ))}
      </div>

      {grants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No grants available at the moment.</div>
        </div>
      )}
    </div>
  );
};

export default GrantsList;