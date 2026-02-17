export default function Navbar({ saveStatus, publishCurrentPost }) {
  return (
    <div className="h-16 bg-white border-b px-8 flex items-center justify-between shadow-sm">
      <h1 className="text-lg font-semibold text-slate-800">
        Smart Blog Dashboard
      </h1>

      <div className="flex items-center gap-6">
        <span className="text-sm text-slate-500">
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved"}
        </span>

        <button
          onClick={publishCurrentPost}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
        >
          Publish
        </button>
      </div>
    </div>
  )
}
