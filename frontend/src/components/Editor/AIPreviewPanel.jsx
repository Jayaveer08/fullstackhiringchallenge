import useAIStore from "../../store/useAIStore";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

const AIPreviewPanel = ({ editor }) => {
  const { result, clearResult } = useAIStore();

  const applyToEditor = () => {
    editor.update(() => {
      // Replace editor content with a paragraph node containing the result
      const root = $getRoot();
      root.clear();
      const p = $createParagraphNode();
      p.append($createTextNode(result));
      root.append(p);
    });
    clearResult();
  };

  if (!result) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">AI Result</h3>
      <p className="whitespace-pre-wrap">{result}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={applyToEditor}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Accept
        </button>

        <button
          onClick={clearResult}
          className="border px-3 py-1 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default AIPreviewPanel;
