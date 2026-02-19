import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { FORMAT_TEXT_COMMAND } from "lexical"
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list"
import { $getSelection, $isRangeSelection } from "lexical"
import { $createHeadingNode } from "@lexical/rich-text"

export default function Toolbar() {
  const [editor] = useLexicalComposerContext()

  const formatHeading = (level) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const heading = $createHeadingNode(level)
        selection.insertNodes([heading])
      }
    })
  }

  const btnBase = "p-2 rounded hover:bg-gray-100 transition flex items-center justify-center border text-gray-700 bg-white"

  return (
    <div className="flex gap-2 mb-4 border-b pb-3 items-center">

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        title="Bold"
        className={`${btnBase} px-3 h-10`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 4a4 4 0 100 8h2a2 2 0 110 4H8" />
        </svg>
        <span className="ml-2 text-sm">Bold</span>
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        title="Italic"
        className={`${btnBase} px-3 h-10`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 4v1l-3 10h2l3-10V4H10z" />
        </svg>
        <span className="ml-2 text-sm">Italic</span>
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        title="Underline"
        className={`${btnBase} px-3 h-10`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 4v6a7 7 0 0014 0V4h-2v6a5 5 0 11-10 0V4H5zM4 20h16v2H4v-2z" />
        </svg>
        <span className="ml-2 text-sm">Underline</span>
      </button>

      <button
        type="button"
        onClick={() => formatHeading("h1")}
        title="Heading 1"
        className={`${btnBase} px-3 h-10 text-sm font-medium`}
      >
        H1
      </button>

      <button
        type="button"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        title="Bullet list"
        className={`${btnBase} px-3 h-10`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5.5A1.5 1.5 0 113.5 7 1.5 1.5 0 012 5.5zM6 6h12v1H6V6zm0 4h12v1H6v-1zM2 10.5A1.5 1.5 0 113.5 12 1.5 1.5 0 012 10.5zM2 15.5A1.5 1.5 0 113.5 17 1.5 1.5 0 012 15.5z" />
        </svg>
        <span className="ml-2 text-sm">Bullet</span>
      </button>

      <button
        type="button"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        title="Numbered list"
        className={`${btnBase} px-3 h-10`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 6h12v2H4V6zm0 4h12v2H4v-2zM3 4h1v1H3V4zm0 4h1v1H3V8zM3 12h1v1H3v-1z" />
        </svg>
        <span className="ml-2 text-sm">Numbered</span>
      </button>

    </div>
  )
}
