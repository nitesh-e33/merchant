import { API_BASE_URL } from "../lib/constant";

export async function apiRequest(method, endpoint, data) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
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
