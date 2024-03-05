import axios from "axios";

// eslint-disable-next-line react-hooks/rules-of-hooks


const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URLS1,
  withCredentials: true,
});
// Thêm các headers mặc định nếu cần
// api.defaults.headers.common["Authorization"] = "Bearer YOUR_ACCESS_TOKEN";
// Đặt cookies vào tiêu đề yêu cầu (nếu có)

export const getData = async (endpoint, params = {}, headers = {}) => {
  try {
    const response = await api.get(endpoint, { params, headers });
    return response; // Trả về toàn bộ phản hồi từ API
  } catch (error) {
    throw error;
  }
};

export const postData = async (endpoint, data, headers = {}) => {
  try {
    const response = await api.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putData = async (endpoint, id, data, headers = {}) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (endpoint, id, headers = {}) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unblockData = async (endpoint, id, headers = {}) => {
  try {
    const response = await api.post(`${endpoint}/unblock/${id}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptProduct= async (endpoint, id, headers= {}) => {
  try {
    const response = await api.post(`${endpoint}/accept/${id}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
    
  }
}

export const rejectProduct= async (endpoint, id, headers= {}) => {
  try {
    const response = await api.post(`${endpoint}/reject/${id}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
    
  }
}

export const postFeedback= async (endpoint, data, headers = {})=> {
  try {
    const response = await api.post(`${endpoint}`, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const hideArtwork = async (endpoint, data, headers = {}) => {
  try {
    const response = await api.post(`${endpoint}`, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unhideArtwork= async (endpoint, id, data, headers = {})=> {
  try {
    const response = await api.post(`${endpoint}/${id}`, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
}