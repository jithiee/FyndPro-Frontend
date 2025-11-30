import axios from "axios";

// console.log(import.meta.env.API_URL);

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh token on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If unauthorized AND we have not retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Call Django refresh API
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/refreshtoken/",
          { refresh: refreshToken }
        );

        // Save new access token
        localStorage.setItem("accessToken", data.access);

        // Update headers for retry
        axiosInstance.defaults.headers.Authorization = `Bearer ${data.access}`;
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return axiosInstance(originalRequest); // retry request
      } catch (err) {
        // If refresh fails → force logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;























// // src/api/axios.js
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Automatically attach JWT access token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;
