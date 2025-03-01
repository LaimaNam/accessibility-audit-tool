import { create } from "zustand";

interface AuditState {
  currentUrl: string;
  auditResults: Record<string, any[]>;
  setUrl: (url: string) => void;
  setAuditResults: (url: string, results: any[]) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  currentUrl: "",
  auditResults: {},
  setUrl: (url) => set({ currentUrl: url }),
  setAuditResults: (url, results) =>
    set((state) => ({
      auditResults: { ...state.auditResults, [url]: results },
    })),
}));
