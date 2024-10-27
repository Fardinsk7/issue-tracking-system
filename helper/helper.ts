import { extname } from 'path';

interface DocumentInfo {
  name: string;
  type: string;
}

export function parseGoogleCloudUrl(urlString: string): DocumentInfo {
  const url = new URL(urlString);
  const path = url.pathname;
  
  // Extract the file name from the path
  const fileName = path.split('/').pop() || '';
  
  // Remove any query parameters from the file name
  const cleanFileName = fileName.split('?')[0];
  
  // Get the file extension
  const fileExtension = extname(cleanFileName).toLowerCase();
  
  return {
    name: cleanFileName,
    type: fileExtension.slice(1) // Remove the leading dot
  };
}

export async function downloadDocument(url: string): Promise<Blob> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('Error downloading the document:', error);
      throw error;
    }
  }
  
  export async function downloadAndSaveDocument(url: string): Promise<void> {
    try {
      const blob = await downloadDocument(url);
      const { name } = parseGoogleCloudUrl(url);
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger the download
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading and saving the document:', error);
      throw error;
    }
  }


export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo':
        return 'bg-yellow-200 text-yellow-800';
      case 'in review':
        return 'bg-purple-200 text-purple-800';
      case 'in progress':
        return 'bg-blue-200 text-blue-800';
      case 'done':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

export const getProblemStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'high':
        return 'bg-orange-500 text-white';
      case 'critical':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  export function formatDateTime(dateString: string): string {
    // Create a date object in UTC
    const utcDate = new Date(dateString);
  
    // Convert to Indian Standard Time (IST is UTC+5:30)
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  
    // Extract individual date components
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const year = istDate.getUTCFullYear();
  
    // Extract individual time components
    let hours = istDate.getUTCHours();
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert 24-hour time to 12-hour time
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight hour
    const formattedHours = String(hours).padStart(2, '0');
  
    // Format to dd/mm/yyyy hr:min AM/PM
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  }
  
 export function toCamelCase(str:string) {
    return str
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }