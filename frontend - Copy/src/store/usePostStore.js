import { create } from "zustand"
import {
  createPost,
  updatePost,
  getPosts,
  getPostById,
  publishPost,
} from "../services/api"

export const usePostStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  saveStatus: "idle", // idle | saving | saved

  // 🔄 Load all posts
  fetchPosts: async () => {
    try {
      const res = await getPosts()
      set({ posts: res.data })
    } catch (err) {
      console.error("Fetch posts failed:", err)
    }
  },

  // 📄 Load single post
  loadPost: async (id) => {
    try {
      const res = await getPostById(id)
      set({ currentPost: res.data })
    } catch (err) {
      console.error("Load post failed:", err)
    }
  },

  // ➕ Create new draft
  createNewPost: async () => {
    try {
      const res = await createPost({
        title: "Untitled",
        content: {
          root: {
            children: [
              {
                type: "paragraph",
                children: [],
                version: 1,
              },
            ],
            type: "root",
            version: 1,
          },
        },
        status: "draft",
      })

      await get().fetchPosts()
      set({ currentPost: res.data })
    } catch (err) {
      console.error("Create post failed:", err)
    }
  },

  // ✏️ Update Title
  updateTitle: async (title) => {
  const { currentPost } = get()
  if (!currentPost) return

  // ✅ Always update UI
  set({
    currentPost: { ...currentPost, title },
  })

  // ❌ Only prevent API call if empty
  if (!title.trim()) {
    return
  }

  set({ saveStatus: "saving" })

  try {
    const res = await updatePost(currentPost._id, { title })

    set({
      currentPost: res.data,
      saveStatus: "saved",
    })

    await get().fetchPosts()
  } catch (err) {
    console.error("Title update failed:", err)
    set({ saveStatus: "idle" })
  }
},



  // 💾 Save Editor Content (Auto-save)
  savePost: async (content) => {
    const { currentPost } = get()
    if (!currentPost) return

    set({ saveStatus: "saving" })

    try {
      const res = await updatePost(currentPost._id, {
        title: currentPost.title,
        content,
      })

      set({
        currentPost: res.data,
        saveStatus: "saved",
      })

      // Do NOT fetchPosts here (performance optimization)

      setTimeout(() => {
        set({ saveStatus: "idle" })
      }, 1500)

    } catch (err) {
      console.error("Save failed:", err)
      set({ saveStatus: "idle" })
    }
  },

  // 🚀 Publish Post
  publishCurrentPost: async () => {
    const { currentPost } = get()
    if (!currentPost) return

    try {
      await publishPost(currentPost._id)

      await get().fetchPosts()

      set({
        currentPost: { ...currentPost, status: "published" },
      })
    } catch (err) {
      console.error("Publish failed:", err)
    }
  },
}))
