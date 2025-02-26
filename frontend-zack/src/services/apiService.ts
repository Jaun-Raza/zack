/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosProgressEvent } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthService = {
  login: async (username: string, password: string, ip: string) => {
    try {
      return await axios.post(`${API_URL}/auth/login`, {
        name: username,
        password,
        ip,
      });
    } catch (e: any) {
      if (e.response && e.response.data.error) return e.response;
      throw e;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/auth/register`, {
        name: username,
        email,
        password,
      });
    } catch (e: any) {
      if (e.response && e.response.data.error) return e.response;
      throw e;
    }
  },

  forgot: async (email: string) => {
    try {
      return await axios.post(`${API_URL}/auth/forgot`, { email });
    } catch (e: any) {
      if (e.response && e.response.data.error) return e.response;
      throw e;
    }
  },

  reset: async (password: string, token: string) => {
    return await axios.post(`${API_URL}/auth/reset`, { password, token });
  },

  verify: async (token: string) => {
    try {
      return await axios.post(`${API_URL}/auth/verify`, { token });
    } catch (e: any) {
      if (e.response && e.response.data.error) return e.response;
      throw e;
    }
  },
};

const ImageService = {
  count: async () => {
    const response = await axios.get(`${API_URL}/image/count`);
    return response.data.count;
  },

  upload: async (
    files: File[],
    progressCallback?: (progress: AxiosProgressEvent) => void
  ) => {
    try {
      const token = localStorage.getItem("token")
        ? localStorage.getItem("token")
        : null;

      const formData = new FormData();
      for (const file of files) formData.append("file", file);

      const axiosClient = axios.create();
      axiosClient.interceptors.request.use((config) => {
        if (progressCallback) {
          config.onUploadProgress = (progress) => {
            progressCallback(progress);
          };
        }
        return config;
      });

      return await axiosClient.post(`${API_URL}/image/upload`, formData, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (e: any) {
      if (e.response && e.response.data.error) return e.response;
      throw e;
    }
  },

  view: async (name: string) => {
    return await axios.get(`${API_URL}/image/${name}`);
  },

  metadata: async (name: string) => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    return await axios.get(`${API_URL}/image/${name}/metadata`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  animate: async (file: File, color1: string, color2: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("color1", color1);
      formData.append("color2", color2);

      return await axios.post(`${API_URL}/image/animate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });
    } catch (e: any) {
      const responseText = await e.response.data.text();
      const responseJson = JSON.parse(responseText);
      if (responseJson && responseJson.error) return responseJson;
      throw e;
    }
  },

  list: async () => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    const response = await axios.get(`${API_URL}/image/list`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  },

  delete: async (name: string) => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    return await axios.delete(`${API_URL}/image/${name}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  listAll: async () => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    const response = await axios.get(`${API_URL}/image/list/all`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  },

  setProfileImage: async (name: string) => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    return await axios.put(
      `${API_URL}/image/profile`,
      { name },
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  },

  comment: async (name: string, comment: string) => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    return await axios.post(
      `${API_URL}/image/${name}/comment`,
      { text: comment },
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  },

  like: async (name: string) => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    return await axios.post(
      `${API_URL}/image/${name}/like`,
      {},
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  },

  dislike: async (name: string) => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    return await axios.post(
      `${API_URL}/image/${name}/dislike`,
      {},
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  },

  unlike: async (name: string) => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;

    return await axios.delete(`${API_URL}/image/${name}/like`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },
};

export { AuthService, ImageService };