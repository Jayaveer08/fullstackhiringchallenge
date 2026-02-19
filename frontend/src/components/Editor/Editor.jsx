import { useEffect, useRef, useState } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ListNode, ListItemNode } from "@lexical/list"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
} from "lexical"

import { usePostStore } from "../../store/usePostStore"
import Toolbar from "./Toolbar"
import AIButtons from "./AIButtons"
import AIPreviewPanel from "./AIPreviewPanel"


function TitleBar() {
  const { currentPost, updateTitle } = usePostStore()
  const [title, setTitle] = useState(currentPost?.title || "")

  // Keep local state in sync when post changes
  useEffect(() => {
    setTitle(currentPost?.title || "")
  }, [currentPost?._id])

  if (!currentPost) return null

  return (
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={() => updateTitle(title)}
      placeholder="Untitled"
      className="w-full text-2xl font-semibold outline-none focus:ring-2 focus:ring-indigo-200 px-2 py-1 rounded"
    />
  )
}



/* ===========================
   LOAD CONTENT SAFELY
=========================== */

function LoadContentPlugin() {
  const [editor] = useLexicalComposerContext()
  const { currentPost } = usePostStore()
  const loadedPostId = useRef(null)

  useEffect(() => {
    if (!currentPost) return
    if (loadedPostId.current === currentPost._id) return

    loadedPostId.current = currentPost._id

    editor.update(() => {
      try {
        if (!currentPost.content?.root?.children?.length) {
          const root = $getRoot()
          root.clear()
          root.append($createParagraphNode())
          return
        }

        const editorState = editor.parseEditorState(
          JSON.stringify(currentPost.content)
        )

        editor.setEditorState(editorState)
      } catch (err) {
        console.error("Failed to load content:", err)

        const root = $getRoot()
        root.clear()
        root.append($createParagraphNode())
      }
    })
  }, [currentPost?._id, editor])

  return null
}



/* ===========================
   AI INTEGRATION PLUGIN
=========================== */

function AIIntegrationPlugin() {
  const [editor] = useLexicalComposerContext()
  const [editorText, setEditorText] = useState("")
  const [token, setToken] = useState(null)

  // Extract plain text on every change
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent()
        setEditorText(text)
      })
    })
  }, [editor])

  // Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
  }, [])

  return (
    <>
      <AIButtons editor={editor} editorText={editorText} token={token} />
      <AIPreviewPanel editor={editor} />
    </>
  )
}



/* ===========================
   MAIN EDITOR COMPONENT
=========================== */

export default function Editor() {
  const { savePost } = usePostStore()
  const timeoutRef = useRef(null)

  const initialConfig = {
    namespace: "SmartBlogEditor",
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
      },
      heading: {
        h1: "text-3xl font-bold",
        h2: "text-2xl font-semibold",
      },
    },
    nodes: [ListNode, ListItemNode, HeadingNode, QuoteNode],
    onError(error) {
      console.error(error)
    },
  }

  /* ===========================
     AUTOSAVE (SAFE VERSION)
  =========================== */

  const handleChange = (editorState) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const json = editorState.toJSON()

      if (!json?.root?.children?.length) return

      json.root.children.forEach((node) => {
        if (node.indent == null || node.indent < 0) {
          node.indent = 0
        }
      })

      savePost(json)
    }, 1000)
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded-lg p-6 bg-white shadow-sm max-w-4xl mx-auto">

        {/* Title + Toolbar Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <TitleBar />
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <Toolbar />
          </div>
        </div>

        {/* AI Buttons will appear below toolbar */}
        <div className="mt-4">
          <AIIntegrationPlugin />
        </div>

        {/* Editor Area */}
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-[300px] mt-4 prose prose-lg max-w-none" />
          }
          placeholder={
            <div className="text-gray-400 mt-4">
              Start writing your blog...
            </div>
          }
        />

        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={handleChange} />
        <LoadContentPlugin />

      </div>
    </LexicalComposer>
  )
}
