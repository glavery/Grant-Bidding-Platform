import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GrantsList from './components/GrantsList';
import BidsList from './components/BidsList';
import GrantDetailModal from './components/GrantDetailModal';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const GrantBiddingApp = () => {
  const [currentView, setCurrentView] = useState('grants');
  const [grants, setGrants] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [bids, setBids] = useState([]);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data functions
  const fetchGrants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/grants`);
      if (!response.ok) throw new Error('Failed to fetch grants');
      const data = await response.json();
      setGrants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_BASE}/organizations`);
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/bids`);
      if (!response.ok) throw new Error('Failed to fetch bids');
      const data = await response.json();
      setBids(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (currentView === 'bids') {
      fetchBids();
    }
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="max-w-7xl mx-auto py-6 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading...</span>
          </div>
        )}

        {currentView === 'grants' && (
          <GrantsList
            grants={grants}
            onSelectGrant={setSelectedGrant}
            organizations={organizations}
            onRefresh={fetchGrants}
          />
        )}

        {currentView === 'bids' && (
          <BidsList bids={bids} />
        )}

        {selectedGrant && (
          <GrantDetailModal
            grant={selectedGrant}
            organizations={organizations}
            onClose={() => setSelectedGrant(null)}
            onBidSubmitted={fetchGrants}
          />
        )}
      </main>
    </div>
  );
};

export default GrantBiddingApp;