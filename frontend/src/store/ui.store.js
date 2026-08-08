import { create } from 'zustand';

/**
 * UI Store
 * 
 * Manages global UI state that doesn't strictly belong to a specific business domain.
 * 
 * State Properties:
 * - globalLoading (Boolean): A generic loading overlay state for heavy, cross-cutting async operations.
 * - activeModal (String | null): Tracks which global modal is currently open.
 * - theme (String): UI color mode ('dark' | 'light' | 'system').
 * - editorLanguage (String): The currently selected language in the Monaco editor.
 * - editorCode (String): The current content in the Monaco editor.
 */
export const useUiStore = create((set, get) => ({
  globalLoading: false,
  activeModal: null,
  theme: 'vs-dark',
  editorLanguage: 'python',
  editorCode: '',

  setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),
  setActiveModal: (modalId) => set({ activeModal: modalId }),
  setTheme: (theme) => set({ theme }),
  setEditorLanguage: (language) => set({ editorLanguage: language }),
  setEditorCode: (code) => set({ editorCode: code }),
  
  closeModal: () => set({ activeModal: null })
}));
