
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
    'Notes'
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
      (lead.notes || '').replace(/,/g, ';').replace(/\n/g, ' ')
    ].map(value => `"${value}"`).join(',');
  });
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
};

/**
 * Download data as a CSV file
 */
export const downloadCSV = (data: string, filename: string): void => {
  // Create a blob with the CSV data
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
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
 * Download leads data as CSV file
 */
export const downloadLeads = (leads: Lead[]): void => {
  const csv = leadsToCSV(leads);
  const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};
