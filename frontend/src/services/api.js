import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api"

const API = axios.create({
  baseURL: API_BASE,
})

/* 🔐 Attach Token Automatically */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* 🔓 Auto logout if token expired */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

/* 🔐 LOGIN FUNCTION */
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams()
  formData.append("username", email) // OAuth2 uses username
  formData.append("password", password)

  const res = await API.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return res.data
}

/* Other API exports */
export const createPost = (data) => API.post("/posts/", data)
export const updatePost = (id, data) => API.patch(`/posts/${id}`, data)
export const getPosts = () => API.get("/posts/")
export const getPostById = (id) => API.get(`/posts/${id}`)
export const publishPost = (id) => API.post(`/posts/${id}/publish`)

export default API
