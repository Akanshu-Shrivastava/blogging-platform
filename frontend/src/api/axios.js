import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Attach token safely
API.interceptors.request.use((config) => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      const user = JSON.parse(storedUser);
      if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (err) {
    console.warn("Error parsing user token:", err);
  }
  return config;
});

const getHeaders = (data) => ({
  "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
});

// BLOG API
export const BlogAPI = {
  getBlogs: (params) => API.get("/blogs", { params }),
  createBlog: (data) => API.post("/blogs", data, { headers: getHeaders(data) }),
  getBlog: (id) => API.get(`/blogs/${id}`),
  updateBlog: (id, data) => API.put(`/blogs/${id}`, data, { headers: getHeaders(data) }),
  deleteBlog: (id) => API.delete(`/blogs/${id}`),
  toggleLike: (id) => API.put(`/blogs/${id}/like`),
  getCategories: () => API.get("/blogs/categories"),
  getComments: (postId) => API.get(`/comments/${postId}`),
  postComment: (postId, data) => API.post("/comments", { postId, ...data }),
  getTags: () => API.get("/tags"),
};

// AUTH API
export const AuthAPI = {
  register: (data) => API.post("/users/register", data),
  login: (data) => API.post("/users/login", data),
  me: () => API.get("/users/me"),
};

// USER API
export const UserAPI = {
  updateAvatar: (formData) =>
    API.put("/users/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProfile: (data) => API.put("/users/profile", data),
};

// ADMIN API
export const AdminAPI = {
  //user
  getUsers: () => API.get("/admin/users"),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  
  //Blogs
  getBlogs: () => API.get("/admin/blogs"),
  deleteBlog: (id) => API.delete(`/admin/blogs/${id}`),
  
  //comments
  getAllComments: () => API.get("/admin/comments"),
  deleteComment: (id) => API.delete(`/admin/comments/${id}`),
  updateComment: (id, data) => API.put(`/admin/comments/${id}`, data),

  //categories
  getCategories: () => API.get("/admin/categories"),
  createCategory: (data) => API.post("/admin/categories", data),
  deleteCategory: (id) => API.delete(`/admin/categories/${id}`),

  //admin
  getTags: () => API.get("/admin/tags"),
  createTag: (data) => API.post("/admin/tags", data),
  deleteTag: (id) => API.delete(`/admin/tags/${id}`),
  createUser: (data) => API.post("/admin/users", data),
  getDashboardStats: () => API.get("/admin/stats"),
};

export default API;
