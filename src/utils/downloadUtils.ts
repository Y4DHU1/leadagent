
/**
 * Utility functions for downloading data
 */

import { Lead } from "@/lib/types";

/**
 * Convert leads data to CSV format
 */
export const leadsToCSV = (leads: Lead[]): string => {
  // Define CSV headers based on lead properties
  const headers = [
    'First Name',
    'Last Name',
    'Company',
    'Position',
    'Email',
    'Phone',
    'Status',
    'Priority',
    'Source',
    'Industry',
    'Location',
    'Budget',
    'Created At',
    'Last Contacted',
    'Notes',
    'AI Score'
  ].join(',');
  
  // Convert each lead to a CSV row
  const rows = leads.map(lead => {
    return [
      lead.firstName,
      lead.lastName,
      lead.company,
      lead.position || '',
      lead.email,
      lead.phone || '',
      lead.status,
      lead.priority,
      lead.source || '',
      lead.industry || '',
      lead.location || '',
      lead.budget || '',
      new Date(lead.createdAt).toLocaleDateString(),
      lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleDateString() : '',
      (lead.notes || '').replace(/,/g, ';').replace(/\n/g, ' '),
      lead.aiScore || ''
    ].map(value => `"${value}"`).join(',');
  });
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
};

/**
 * Format leads data for Excel export (using TSV format which Excel opens correctly)
 */
export const leadsToExcel = (leads: Lead[]): string => {
  // Define headers for Excel
  const headers = [
    'First Name',
    'Last Name',
    'Company',
    'Position',
    'Email',
    'Phone',
    'Status',
    'Priority',
    'Source',
    'Industry',
    'Location',
    'Budget',
    'Created At',
    'Last Contacted',
    'AI Score',
    'Notes'
  ].join('\t');
  
  // Convert each lead to an Excel row (TSV format)
  const rows = leads.map(lead => {
    return [
      lead.firstName,
      lead.lastName,
      lead.company,
      lead.position || '',
      lead.email,
      lead.phone || '',
      lead.status,
      lead.priority,
      lead.source || '',
      lead.industry || '',
      lead.location || '',
      lead.budget || '',
      new Date(lead.createdAt).toLocaleDateString(),
      lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleDateString() : '',
      lead.aiScore || '',
      (lead.notes || '').replace(/\t/g, ' ').replace(/\n/g, ' ')
    ].join('\t');
  });
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
};

/**
 * Download data as a file
 */
export const downloadFile = (data: string, filename: string, type: string): void => {
  // Create a blob with the data
  const blob = new Blob([data], { type: `${type};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element to trigger the download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add the link to the DOM, click it, and then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Revoke the URL to free up memory
  URL.revokeObjectURL(url);
};

/**
 * Download data as a CSV file
 */
export const downloadCSV = (data: string, filename: string): void => {
  downloadFile(data, filename, 'text/csv');
};

/**
 * Download data as an Excel file (TSV format that Excel can open)
 */
export const downloadExcel = (data: string, filename: string): void => {
  downloadFile(data, `${filename}.xls`, 'application/vnd.ms-excel');
};

/**
 * Download leads data as CSV file
 */
export const downloadLeads = (leads: Lead[], format: 'csv' | 'excel' = 'csv'): void => {
  const date = new Date().toISOString().split('T')[0];
  
  if (format === 'excel') {
    const excel = leadsToExcel(leads);
    downloadExcel(excel, `leads-export-${date}`);
  } else {
    const csv = leadsToCSV(leads);
    downloadCSV(csv, `leads-export-${date}.csv`);
  }
};
