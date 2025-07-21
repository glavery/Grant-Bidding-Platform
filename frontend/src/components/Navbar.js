import React from 'react';

const Navbar = ({ currentView, setCurrentView }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">Grant Bidding Platform</h1>
          <div className="space-x-4">
            <button
              onClick={() => setCurrentView('grants')}
              className={`px-4 py-2 rounded ${currentView === 'grants' ? 'bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'}`}
            >
              Browse Grants
            </button>
            <button
              onClick={() => setCurrentView('bids')}
              className={`px-4 py-2 rounded ${currentView === 'bids' ? 'bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'}`}
            >
              View Bids
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;