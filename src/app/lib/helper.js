import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
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
export const generateAndCompareDeviceId = async (router) => {
  const deviceId = Cookies.get('device_id');

  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const currentId = result.visitorId;

  if (deviceId !== currentId) {
    Cookies.remove('device_id');
    Cookies.remove('user');
    router.push('/');
  }
};