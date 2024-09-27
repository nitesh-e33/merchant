import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { apiRequest } from "./apiHelper";
import $ from 'jquery';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from "./constant";

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

export const initSelect2 = (setSearchName, setPaymentStatus, setPaymentMode) => {
  $('.select2').select2();
  $('.select2').on('change', function () {
    const name = $(this).attr('name');
    const value = $(this).val();
    if (name === 'searchName') {
      setSearchName(value);
    } else if (name === 'paymentStatus') {
      setPaymentStatus && setPaymentStatus(value);
    } else if (name === 'paymentMode') {
      setPaymentMode && setPaymentMode(value);
    }
  });
};

export const fetchDataHelper = async (dto, dateRange, searchName, searchValue, fetchDataFn, additionalParams = {}) => {
  if (dto === 'custom_range' && (!dateRange || !dateRange[0] || !dateRange[1])) {
    return;
  }
  const searchParams = {
    dto,
    ...(dto === 'custom_range' && dateRange && dateRange[0] && dateRange[1] && {
      start_date: dateRange[0].toISOString().split('T')[0],
      end_date: dateRange[1].toISOString().split('T')[0],
    }),
    [searchName]: searchValue,
    ...additionalParams
  };
  const data = await fetchDataFn(searchParams);
  return data;
};

export const decryptedData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptedData) {
      return JSON.parse(decryptedData);
    }
    return {};
  } catch (error) {
    console.error('Decryption failed:', error.message);
    return {};
  }
};
