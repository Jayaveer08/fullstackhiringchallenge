import { useEffect, useState, useMemo } from "react"
import { usePostStore } from "../store/usePostStore"

export default function Layout({ children }) {
  const {
    posts,
    fetchPosts,
    loadPost,
    currentPost,
    saveStatus,
    publishCurrentPost,
  } = usePostStore()

  const [search, setSearch] = useState("")

  // 🔄 Fetch posts on mount
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 🔎 Filter posts (memoized for performance)
  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title?.toLowerCase().includes(search.toLowerCase())
    )
  }, [posts, search])

  const drafts = filteredPosts.filter((p) => p.status === "draft")
  const published = filteredPosts.filter((p) => p.status === "published")

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* 🔝 Top Bar */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">

        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-800">
          Smart Blog
        </h1>

        {/* Right Controls */}
        <div className="flex items-center gap-6">

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* 💾 Save Status */}
          <span className="text-sm text-gray-500">
            {saveStatus === "saving" && "💾 Saving..."}
            {saveStatus === "saved" && "💾 Saved"}
          </span>

          {/* 🚀 Publish */}
          <button
            onClick={publishCurrentPost}
            disabled={!currentPost}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            🚀 Publish
          </button>

        </div>
      </div>

      {/* 🧱 Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* 📂 Sidebar */}
        <div className="w-64 bg-white border-r p-6 overflow-y-auto">

          {/* Drafts */}
          <div className="mb-10">
            <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wide">
              Drafts
            </h3>

            <div className="space-y-2">
              {drafts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => loadPost(post._id)}
                  className={`cursor-pointer p-2 rounded-lg text-sm hover:bg-gray-100 transition ${
                    currentPost?._id === post._id
                      ? "bg-indigo-100 font-medium"
                      : ""
                  }`}
                >
                  📄 {post.title || "Untitled"}
                </div>
              ))}

              {drafts.length === 0 && (
                <p className="text-xs text-gray-400">
                  No drafts found
                </p>
              )}
            </div>
          </div>

          {/* Published */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wide">
              Published
            </h3>

            <div className="space-y-2">
              {published.map((post) => (
                <div
                  key={post._id}
                  onClick={() => loadPost(post._id)}
                  className={`cursor-pointer p-2 rounded-lg text-sm hover:bg-gray-100 transition ${
                    currentPost?._id === post._id
                      ? "bg-green-100 font-medium"
                      : ""
                  }`}
                >
                  ✅ {post.title || "Untitled"}
                </div>
              ))}

              {published.length === 0 && (
                <p className="text-xs text-gray-400">
                  No published posts
                </p>
              )}
            </div>
          </div>

        </div>

        {/* 📝 Main Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  )
}
