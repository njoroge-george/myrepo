import apiClient from "./apiClient.jsx";

// 🔐 Attach token to every request
apiClient.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// 🔄 Handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await apiClient.post("/auth/refresh", { token: refreshToken });
        const { token: newToken, refreshToken: newRefreshToken } = res.data;

        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        return apiClient(originalRequest);
      } catch (err) {
        console.error("🔒 Token refresh failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// 🧩 Auth API calls
export const registerUser = (userData) =>
  apiClient.post("/auth/register", userData);

export const loginUser = (userData) =>
  apiClient.post("/auth/login", userData);

export const refreshToken = (token) =>
  apiClient.post("/auth/refresh", { token });

export const getProfile = () =>
  apiClient.get("/auth/profile");

export const getAdminData = () =>
  apiClient.get("/auth/admin");

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};
