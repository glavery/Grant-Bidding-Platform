// Utility functions for formatting

// Format currency to GBP
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);
};

// Format date to UK format
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB');
};

// Get status color based on grant status
export const getGrantStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-800';
    case 'closed': return 'bg-red-100 text-red-800';
    case 'awarded': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get status color based on bid status
export const getBidStatusColor = (status) => {
  switch (status) {
    case 'submitted': return 'bg-yellow-100 text-yellow-800';
    case 'under_review': return 'bg-blue-100 text-blue-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};