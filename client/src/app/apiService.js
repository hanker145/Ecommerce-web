import axios from "axios";
import { DOMAIN_URL } from "./config";

const apiService = axios.create({
  baseURL: DOMAIN_URL,
});

// Console.log All Request, Request error & Response, Response error
apiService.interceptors.request.use(
  (request) => {
    console.log("Start Request", request);
    return request;
  },
  function (error) {
    console.log("Request Error", error);
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    // console.log("Response", response);
    return response;
  },
  function (error) {
    // console.log("Response Error", error);
    const message = error.response?.data?.message || "Unknown";
    return Promise.reject({ message });
  }
);

export default apiService;
