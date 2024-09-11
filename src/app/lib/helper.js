import { toast } from "react-toastify";

export const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
};

export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// Function to handle copying link to clipboard
export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied Successfully');
      })
      .catch(() => {
        toast.error('Failed to copy.');
    });
};