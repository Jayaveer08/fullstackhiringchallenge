import { create } from "zustand";

const useAIStore = create((set) => ({
  isGenerating: false,
  result: "",
  error: null,
  controller: null,

  setGenerating: (val) => set({ isGenerating: val }),
  setController: (c) => set({ controller: c }),
  cancelGeneration: () =>
    set((state) => {
      try {
        state.controller?.abort?.();
      } catch (e) {}
      return { isGenerating: false, controller: null };
    }),
  appendResult: (chunk) =>
    set((state) => ({ result: state.result + chunk })),
  clearResult: () => set({ result: "" }),
  setError: (err) => set({ error: err }),
}));

export default useAIStore;
