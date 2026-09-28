import axios, {
    AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

const apiClient = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL || "http://localhost:8000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Prevent multiple requests from triggering multiple refresh requests
let refreshPromise: Promise<void> | null = null;

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error: AxiosError) => {
        const originalRequest =
            error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };

        // Only handle 401 responses
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Never refresh if the failed request was already /refresh
        if (originalRequest.url?.includes("/api/v1/auth/refresh")) {
            return Promise.reject(error);
        }

        // Prevent infinite retry loop
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // If another request is already refreshing,
            // wait for that same refresh request.
            if (!refreshPromise) {
                refreshPromise = apiClient
                    .post("/api/v1/auth/refresh")
                    .then(() => {
                        // New access + refresh cookies were
                        // set by the backend automatically.
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            await refreshPromise;

            // Refresh succeeded.
            // Browser now has the new HttpOnly cookies.
            // Retry the original request.
            return apiClient(originalRequest);
        } catch (refreshError) {
            // Refresh failed.
            // The authentication session is no longer valid.
            return Promise.reject(refreshError);
        }
    }
);

export default apiClient;