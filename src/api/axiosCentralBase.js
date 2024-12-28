import axios from "axios";

// Base axios object
const axiosCentral = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// axios - error handler
axiosCentral.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Error in response interceptor:", error);
    console.log("Error in response interceptor:", error.response?.data);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          return Promise.reject(new Error("Bad Request"));
        case 401:
          return Promise.reject(new Error("Unauthorized"));
        case 404:
          return Promise.reject(new Error("Not Found"));
        case 409:
          return Promise.reject(new Error("Email field must be unique"));
        case 500:
          return Promise.reject(new Error("Internal Server Error"));
      }
    }

    if (error.request) {
      return Promise.reject(new Error("Network Error"));
    }

    return Promise.reject(new Error(`An error occurred: ${error.message}`));
  }
);

// Generic Get function
export const genericGet = async (requestDTO, url) => {
  try {
    const response = await axiosCentral.get(url, {
      params: requestDTO,
    });
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    if (error) {
      console.error("Error: ", error.toString());
      throw new Error(`Response data validation error: ${error.toString()}`);
    }
    throw new Error(`General error: ${error}`);
  }
};

// Generic Patch function
export const genericPatch = async (requestDTO, url) => {
  try {
    const response = await axiosCentral.patch(url, requestDTO);
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.toString());
    throw new Error(`Response data validation error: ${error.toString()}`);
  }
};

// Generic Put function
export const genericPut = async (requestDTO, url) => {
  try {
    const response = await axiosCentral.put(url, requestDTO);
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.toString());
    throw new Error(`Response data validation error: ${error.toString()}`);
  }
};

// Generic Post function
export const genericPost = async (requestDTO, url) => {
  try {
    const response = await axiosCentral.post(url, requestDTO);
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.toString());
    throw new Error(`Response data validation error: ${error.toString()}`);
  }
};

// Generic Post function
export const genericDelete = async (requestDTO, url) => {
  try {
    const response = await axiosCentral.delete(url, requestDTO);
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.toString());
    throw new Error(`Response data validation error: ${error.toString()}`);
  }
};
