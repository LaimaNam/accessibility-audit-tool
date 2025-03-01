import { create } from "zustand";

interface AuditState {
  currentUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auditResults: Record<string, any[]>;
  setUrl: (url: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
