import Layout from "../components/Layout";
import Editor from "../components/Editor/Editor";
import { usePostStore } from "../store/usePostStore";

export default function App() {
  const {
    currentPost,
    createNewPost,
    publishCurrentPost,
    saveStatus,
    updateTitle,
  } = usePostStore()

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10">

        {!currentPost && (
          <div className="text-center py-20">
            <button
              onClick={createNewPost}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
            >
              + Create New Draft
            </button>
          </div>
        )}

        {currentPost && (
          <>
            <div className="flex justify-between items-center mb-6">
              <input
                type="text"
                value={currentPost.title}
                onChange={(e) => updateTitle(e.target.value)}
                className="text-4xl font-bold w-full outline-none border-b pb-4"
              />

              <div className="flex items-center gap-4 ml-6">
                <span className="text-sm text-gray-500">
                  {saveStatus === "saving" && "Saving..."}
                  {saveStatus === "saved" && "Saved"}
                </span>

                <button
                  onClick={publishCurrentPost}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg"
                >
                  Publish
                </button>
              </div>
            </div>

            <Editor />
          </>
  
  )}
      </div>
    </Layout>
  )
}
