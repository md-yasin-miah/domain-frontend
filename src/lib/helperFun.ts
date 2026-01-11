import { TFunction } from "i18next";
import moment from "moment";
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (!value) return '---';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '---';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

export const formatNumber = (value: number | string | null | undefined): string => {
  if (!value) return '---';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '---';
  return new Intl.NumberFormat('en-US').format(numValue);
};

export const getStatusColor = (status: string) => {
  const statusColor = () => {
  switch (status) {
    case 'resolved':
    case 'accepted':
    case 'verified':
    case 'active':return 'bg-green-500';
    case 'failed': 
    case 'rejected': 
    case 'inactive':
    case 'expired': return 'bg-red-500';
    case 'in_progress': 
    case 'pending': return 'bg-yellow-500';
    case 'open': 
    case 'countered': return 'bg-blue-500';
    case 'closed': 
    case 'withdrawn': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
}
return "text-white " + statusColor();
};

export const getStatusLabel = (status: string,t: TFunction) => {
  return t(`common.status.${status}`) || status;
};
export const timeFormat = (date: string, format: string = 'MM/DD/YYYY') => {
  if (!date) return '---';
  return moment(date).format(format);
};
export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed':
    case 'accepted':
    case 'verified': return 'default';
    case 'processing': return 'secondary';
    case 'pending': return 'outline';
    case 'cancelled':
    case 'rejected': return 'destructive';
    case 'refunded': return 'destructive';
    case 'countered': return 'secondary';
    case 'withdrawn':
    case 'expired': return 'outline';
    default: return 'outline';
  }
};