import { API_BASE_URL } from "../lib/constant";

export async function apiRequest(method, endpoint, data) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    // Get token using the getToken function
    const token = getToken();

    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const options = {
      method: method,
      headers: headers
    };

    if (method === 'GET' && data) {
      Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
    } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
}

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
