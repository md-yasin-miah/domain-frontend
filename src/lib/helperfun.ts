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
    case 'inactive':
    case 'Inactivo': return 'bg-red-500';
    case 'expired':
    case 'Expirado': return 'bg-red-500';
    case 'pending':
    case 'Pendiente': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};
export const getStatusLabel = (status: string, t: TFunction, type: 'domains' | 'websites' | 'apps' = 'domains') => {
  const statusMap: Record<string, string> = {
    'active': type === 'domains' ? t('domains.status.active') : type === 'websites' ? t('websites.status.active') : t('apps.status.active'),
    'inactive': type === 'websites' ? t('websites.status.inactive') : t('apps.status.inactive'),
    'expired': t('domains.status.expired'),
    'pending': type === 'domains' ? t('domains.status.pending') : type === 'websites' ? t('websites.status.pending') : t('apps.status.pending')
  };
  return statusMap[status] || status;
};
export const timeFormat = (date: string, format: string = 'MM/DD/YYYY') => {
  if (!date) return '---';
  return moment(date).format(format);
};