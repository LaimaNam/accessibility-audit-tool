import { create } from "zustand";

interface IssueResults {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  violations: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incomplete: any[];
  url: string;
  score?: number;
}

interface AuditState {
  currentUrl: string;
  auditResults: Record<string, IssueResults>;
  setUrl: (url: string) => void;
  setAuditResults: (url: string, results: IssueResults) => void;
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
