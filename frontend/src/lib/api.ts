const API_BASE_URL = "http://localhost:8000/api/v1";

interface ApiOptions extends RequestInit {
  data?: any;
}

export const api = {
  async fetch(endpoint: string, options: ApiOptions = {}) {
    const { data, headers, ...customConfig } = options;
    
    const config: RequestInit = {
      ...customConfig,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      // Important: include credentials so the HttpOnly cookie is sent!
      credentials: "include",
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // If unauthorized, could trigger a redirect or event
    if (response.status === 401) {
      // Avoid redirect loops if already on login
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return response;
  },
  
  async get(endpoint: string, options?: ApiOptions) {
    return this.fetch(endpoint, { ...options, method: "GET" });
  },
  
  async post(endpoint: string, data?: any, options?: ApiOptions) {
    return this.fetch(endpoint, { ...options, method: "POST", data });
  },
  
  async patch(endpoint: string, data?: any, options?: ApiOptions) {
    return this.fetch(endpoint, { ...options, method: "PATCH", data });
  },
  
  async delete(endpoint: string, options?: ApiOptions) {
    return this.fetch(endpoint, { ...options, method: "DELETE" });
  }
};
