import React, { useState } from 'react';
import { formatCurrency, formatDate } from './utils';

const API_BASE = 'http://localhost:8000';

const GrantDetailModal = ({ grant, organizations, onClose, onBidSubmitted }) => {
  const [formData, setFormData] = useState({
    organization_id: '',
    title: '',
    proposal: '',
    requested_amount: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    // Validate required fields
    if (!formData.organization_id || !formData.title || !formData.proposal || !formData.requested_amount) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_id: grant.id,
          ...formData,
          requested_amount: parseFloat(formData.requested_amount)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit bid');
      }

      setSuccess(true);
      onBidSubmitted();
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bid Submitted Successfully!</h3>
            <p className="text-gray-600">Your bid has been submitted and is now under review.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{grant.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Grant Details</h3>
              <div className="space-y-3 mb-6">
                <div>
                  <span className="font-medium text-gray-700">Funding Amount:</span>
                  <span className="ml-2 text-green-600 font-semibold">{formatCurrency(grant.funding_amount)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Application Deadline:</span>
                  <span className="ml-2">{formatDate(grant.application_deadline)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Posted by:</span>
                  <span className="ml-2">{grant.created_by_name}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
                <p className="text-gray-600 leading-relaxed">{grant.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Submit Your Bid</h3>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization *
                  </label>
                  <select
                    name="organization_id"
                    value={formData.organization_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an organization</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bid Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title for your bid"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requested Amount (£) *
                  </label>
                  <input
                    type="number"
                    name="requested_amount"
                    value={formData.requested_amount}
                    onChange={handleChange}
                    min="0"
                    max={grant.funding_amount}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Proposal *
                  </label>
                  <textarea
                    name="proposal"
                    value={formData.proposal}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe your project, objectives, methodology, and expected outcomes..."
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Bid'}
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantDetailModal;