// import axios from 'axios';

export async function apiRequest(type, api, data = {}) {

  const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  let headers = {};

  if (shouldBypassToken(api)) {
    const token = data.token || getToken();
    headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    // Add headers to data object
    data.headers = headers;

    // Add headers to post object if it exists, or create a new one
    if (data.post) {
      data.post.headers = headers;
    } else {
      data.post = { headers };
    }
  }

  try {
    type = type.toLowerCase();
    api = `${api_url}${api}`;
    let response;

    switch (type) {
      case 'get':
        const getParams = data.get || {};
        const queryParams = new URLSearchParams(getParams).toString();
          // const getConfig = {
          //   params: getParams,
          //   headers: { ...headers, ...(data.headers || {}) },
          // };
          // response = await axios.get(api, getConfig);
          response = await fetch(`/api/proxy?apiUrl=${encodeURIComponent(api)}&queryParams=${encodeURIComponent(queryParams)}`, {
            method: 'GET',
            headers: {
              ...headers,
            },
          });
          break;

      case 'post':
      case 'delete':
        let postData = data.post || {};

        // if (postData instanceof FormData) {
        //   headers['Content-Type'] = 'multipart/form-data';
        // } else {
        //   const multipart = [];

        //   Object.entries(postData).forEach(([key, value]) => {
        //     if (Array.isArray(value)) {
        //       value.forEach((item) => {
        //         multipart.push({ name: `${key}[]`, contents: item });
        //       });
        //     } else {
        //       multipart.push({ name: key, contents: value });
        //     }
        //   });

        //   if (data.files) {
        //     Object.entries(data.files).forEach(([key, file]) => {
        //       multipart.push({ name: key, contents: file });
        //     });
        //   }

        //   postData = new FormData();
        //   multipart.forEach(({ name, contents }) => {
        //     postData.append(name, contents);
        //   });

        //   headers['Content-Type'] = 'multipart/form-data';
        // }

        // const postConfig = {
        //   headers: { ...headers, ...(data.headers || {}) },
        // };
        // response = await axios[type](api, postData, postConfig);

        if (type === 'post') {
          response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: JSON.stringify({ apiUrl: api, requestData: postData, headers: headers }),
          });
        }
        break;

      case 'put':
        // Implement PUT request logic here if needed
        break;

      default:
        throw new Error(`Unsupported request type: ${type}`);
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
    if (e.response && e.response.status === 401) {
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
