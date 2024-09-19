// import axios from 'axios';

export async function apiRequest(type, api, data = {}) {

  const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const headers = shouldBypassToken(api)
    ? {
        Authorization: `Bearer ${data.token || getToken()}`,
        Accept: 'application/json',
      }
    : {};

  try {
    const apiEndpoint = `${api_url}${api}`;
    let response;

    if (type.toLowerCase() === 'get') {
      const queryParams = new URLSearchParams(data.get || {}).toString();
      response = await fetch(`/api/proxy?apiUrl=${encodeURIComponent(apiEndpoint)}&queryParams=${encodeURIComponent(queryParams)}`, {
        method: 'GET',
        headers,
      });
    } else {
      const postData = data.post || {};
      const isFormData = postData instanceof FormData;
      const headersWithContentType = {
        ...headers,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      };
      if (isFormData) {
        const formData = new FormData();
        formData.append('apiUrl', apiEndpoint);
        postData.forEach((value, key) => {
          formData.append(key, value);
        });

        response = await fetch('/api/proxy', {
          method: type.toUpperCase(),
          headers: headersWithContentType,
          body: formData,
        });
      } else {
        response = await fetch('/api/proxy', {
          method: type.toUpperCase(),
          headers: headersWithContentType,
          body: JSON.stringify({
            apiUrl: apiEndpoint,
            requestData: postData,
            headers,
          }),
        });
      }
    }

    // const responseContainer = response.data;
    const responseContainer = await response.json();

    // Clean up temporary files if necessary
    if (response.status === 200 && data.files) {
      Object.values(data.files).forEach((file) => {
        URL.revokeObjectURL(file);
      });
    }

    return responseContainer;
  } catch (e) {
    console.error(`apiRequest_${api}`, e);
    if (e.response?.status === 401) {
      return {
        StatusCode: '0',
        Message: 'Unauthenticated User or Token expired',
      };
    }
    throw e;
  }
}

const shouldBypassToken = (api) => {
  const bypassUrls = [
    'merchant/login',
    'forgot-password',
    'check-user-reset-token',
    'reset-password',
  ];

  return !bypassUrls.includes(api);
};

function getToken() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userObject = JSON.parse(user);
        return userObject.token || null;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
  }
  return null;
}
