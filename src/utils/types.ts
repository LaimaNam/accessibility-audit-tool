export type AxeNode = {
  any: Array<{
    id: string;
    data: unknown;
    relatedNodes: Array<{
      html: string;
      target: string[];
    }>;
    impact: "critical" | "serious" | "moderate" | "minor";
    message: string;
  }>;
  all: Array<{
    id: string;
    data: unknown;
    relatedNodes: Array<{
      html: string;
      target: string[];
    }>;
    impact: "critical" | "serious" | "moderate" | "minor";
    message: string;
  }>;
  none: Array<{
    id: string;
    data: unknown;
    relatedNodes: Array<{
      html: string;
      target: string[];
    }>;
    impact: "critical" | "serious" | "moderate" | "minor";
    message: string;
  }>;
  impact: "critical" | "serious" | "moderate" | "minor";
  html: string;
  target: string[];
  failureSummary: string;
};
