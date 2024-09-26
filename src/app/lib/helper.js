import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { apiRequest } from "./apiHelper";
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
// Helper function to filter searchParams
function filterSearchParams(searchParams) {
  return Object.fromEntries(
    Object.entries(searchParams).filter(([key, value]) => key.trim() !== '' && value.trim() !== '')
  );
}
// Helper function to manage localStorage with caching
function getCachedData(key, maxAgeInMs) {
  const cachedData = localStorage.getItem(key);
  const cachedTime = localStorage.getItem(`${key}_timestamp`);
  if (cachedData && cachedTime && (Date.now() - cachedTime < maxAgeInMs)) {
    return JSON.parse(cachedData);
  }
  return null;
}
function setCachedData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`${key}_timestamp`, Date.now());
}

// Helper function to handle API requests
export async function handleApiRequest(url, searchParams, cacheKey, cacheExpiryTime) {
  const filteredParams = filterSearchParams(searchParams);
  const isThisMonthOnly = Object.keys(filteredParams).length === 1 && filteredParams.dto === 'this_month';
  if (isThisMonthOnly) {
    const cachedData = getCachedData(cacheKey, cacheExpiryTime);
    if (cachedData) return cachedData;
  }

  try {
    const response = await apiRequest('POST', url, { post: searchParams });
    if (response.StatusCode === "1") {
      const resultData = response.Result;
      if (isThisMonthOnly) {
        setCachedData(cacheKey, resultData);
      }
      return resultData;
    } else {
      toast.error(response.Result || 'Something went wrong. Please try again later.');
      return [];
    }
  } catch (error) {
    toast.error('An error occurred while fetching the data');
    console.error('Error fetching data:', error);
    return [];
  }
}