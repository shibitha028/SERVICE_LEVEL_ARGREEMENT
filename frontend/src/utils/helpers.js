// Format minutes into human-readable string
export const formatMinutes = (min) => {
  if (min < 60)   return `${min}m`;
  if (min < 1440) return `${Math.round(min / 60)}h`;
  return `${Math.round(min / 1440)}d`;
};

// Format currency
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

// Compliance rate color
export const complianceColor = (rate) => {
  if (rate >= 95) return 'var(--green)';
  if (rate >= 80) return 'var(--amber)';
  return 'var(--red)';
};

// Time ago string
export const timeAgo = (date) => {
  const sec = Math.floor((Date.now() - new Date(date)) / 1000);
  if (sec < 60)   return 'just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400)return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
};

// Get tier badge class
export const tierBadgeClass = (tier) => ({
  Gold: 'badge-gold', Silver: 'badge-silver', Bronze: 'badge-bronze',
}[tier] ?? 'badge-pending');

// Get status badge class
export const statusBadgeClass = (status) => ({
  Open: 'badge-open', 'In Progress': 'badge-progress',
  Resolved: 'badge-closed', Closed: 'badge-closed',
  Approved: 'badge-approved', Rejected: 'badge-rejected', Pending: 'badge-pending',
  Acknowledged: 'badge-progress', Escalated: 'badge-rejected',
}[status] ?? 'badge-pending');
