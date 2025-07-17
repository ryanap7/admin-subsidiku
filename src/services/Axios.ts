import axios, { AxiosInstance, AxiosResponse } from "axios";
// import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL_MAIN;
// const isServer = typeof window === "undefined";

// const redirectToLogin = () => {
//   if (!isServer) {
//     Cookies.remove("token");
//     Cookies.remove("role");
//     localStorage.clear();
//     if (window.location.pathname !== "/login") {
//       window.location.replace("/login");
//     }
//   }
// };

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  // if (!isServer) {
  //   const token = Cookies.get("token");
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }
  // }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // const status = error?.response?.status;

    // if (!isServer && status === 401) {
    //   redirectToLogin();
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
