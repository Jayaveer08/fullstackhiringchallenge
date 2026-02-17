import { usePostStore } from "../store/usePostStore"

export default function Sidebar() {
  const { posts, fetchPostById } = usePostStore()

  const drafts = posts.filter(p => p.status === "draft")
  const published = posts.filter(p => p.status === "published")

  return (
    <div className="w-64 bg-white border-r h-[calc(100vh-4rem)] p-6 overflow-y-auto">
      
      <h2 className="text-xs font-semibold text-slate-400 uppercase mb-3">
        Drafts
      </h2>

      {drafts.map(post => (
        <div
          key={post._id}
          onClick={() => fetchPostById(post._id)}
          className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer mb-1 transition"
        >
          {post.title}
        </div>
      ))}

      <h2 className="text-xs font-semibold text-slate-400 uppercase mt-6 mb-3">
        Published
      </h2>

      {published.map(post => (
        <div
          key={post._id}
          onClick={() => fetchPostById(post._id)}
          className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer mb-1 transition text-emerald-600"
        >
          {post.title}
        </div>
      ))}

    </div>
  )
}
