import useAIStore from "../../store/useAIStore";
import { streamAI } from "../../services/aiService";

const AIButtons = ({ editor, token, editorText }) => {
  const { isGenerating } = useAIStore();

  const getEditorText = () => {
    // Prefer the pre-extracted `editorText` prop from the integration plugin
    if (editorText && editorText.trim().length) return editorText;

    // Fallback: read from editor DOM safely
    try {
      let text = "";
      editor.getEditorState().read(() => {
        const root = editor.getRootElement && editor.getRootElement();
        if (root) text = root.innerText || "";
      });
      return text;
    } catch (e) {
      return "";
    }
  };

  const handleAI = async (action) => {
    const text = getEditorText();
    if (!text || !text.trim()) return;
    await streamAI(text, action, token);
  };

  const cancel = () => {
    useAIStore.getState().cancelGeneration();
  };

  const disabled = isGenerating || !editorText || !editorText.trim();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAI("summary")}
        className={`px-3 py-1 rounded text-white ${disabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={disabled}
      >
        Generate Summary
      </button>

      <button
        onClick={() => handleAI("grammar")}
        className={`px-3 py-1 rounded text-white ${disabled ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        disabled={disabled}
      >
        Fix Grammar
      </button>

      {isGenerating ? (
        <>
          <button
            onClick={cancel}
            className="ml-2 px-2 py-1 border rounded text-sm"
          >
            Cancel
          </button>
          <span className="text-sm text-gray-500 ml-2">Generating...</span>
        </>
      ) : null}
    </div>
  );
};

export default AIButtons;
