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
  switch (status) {
    case 'active':
    case 'Activo': return 'bg-green-500';
    case 'expired':
    case 'Expirado': return 'bg-red-500';
    case 'pending':
    case 'Pendiente': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};
export const getStatusLabel = (status: string, t: TFunction) => {
  const statusMap: Record<string, string> = {
    'active': t('domains.status.active'),
    'inactive': t('websites.status.inactive'),
    'expired': t('domains.status.expired'),
    'pending': t('domains.status.pending')
  };
  return statusMap[status] || status;
};
export const timeFormat = (date: string, format: string = 'MM/DD/YYYY') => {
  if (!date) return '---';
  return moment(date).format(format);
};