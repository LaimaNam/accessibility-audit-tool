import { AxeNode } from "@/utils/types";
import React, { useState } from "react";

interface Violation {
  id: string;
  url: string;
  impact?: string;
  description?: string;
  help?: string;
  helpUrl?: string;
  html?: string;
  score?: number;
  nodes?: AxeNode[];
}

interface ViolationTableProps {
  violations: Violation[];
}

export const ViolationsTable: React.FC<ViolationTableProps> = ({
  violations,
}) => {
  const [filter, setFilter] = useState<string>("");
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleCopyToClipboard = () => {
    const copyText = violations
      .map(
        (v) =>
          `URL: ${v.url}\nImpact: ${v.impact}\nDescription: ${v.description}\nHelp: ${v.help}\nHelp URL: ${v.helpUrl}\n\n`
      )
      .join("");
    navigator.clipboard.writeText(copyText);
  };

  const handleRowClick = (url: string) => {
    setExpandedUrl(expandedUrl === url ? null : url);
  };

  const filteredViolations = violations.filter(
    (violation) =>
      violation.description?.toLowerCase().includes(filter.toLowerCase()) ||
      violation.url?.toLowerCase().includes(filter.toLowerCase()) ||
      violation.impact?.toLowerCase().includes(filter.toLowerCase())
  );

  const violationsByUrl = filteredViolations.reduce<
    Record<string, Violation[]>
  >((acc, violation) => {
    if (!acc[violation.url]) {
      acc[violation.url] = [];
    }
    acc[violation.url].push(violation);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Filter violations..."
        value={filter}
        onChange={handleFilterChange}
        className="p-2 border rounded w-full mb-4"
      />
      <button
        onClick={handleCopyToClipboard}
        className="p-2 bg-blue-500 text-white rounded mb-4"
      >
        Copy to Clipboard
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">URL</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Impact</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Help</th>
            <th className="border p-2">Nodes</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(violationsByUrl).map(([url, violations]) => (
            <React.Fragment key={url}>
              <tr
                key={url}
                className="bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(url)}
              >
                <td className="border p-2" colSpan={6}>
                  <span className="font-bold">{url}</span> ({violations.length}{" "}
                  violations)
                </td>
              </tr>
              {expandedUrl === url &&
                violations.map((violation, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border p-2"></td>
                    <td className="border p-2">{violation.score ?? "N/A"}</td>
                    <td className="border p-2">{violation.impact}</td>
                    <td className="border p-2">{violation.description}</td>
                    <td className="border p-2">
                      {violation.helpUrl ? (
                        <a
                          href={violation.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          {violation.help}
                        </a>
                      ) : (
                        violation.help
                      )}
                    </td>
                    <td className="border p-2">
                      {!!violation?.nodes?.length &&
                        violation.nodes.map((node, nodeIndex) => (
                          <div key={nodeIndex} className="mb-2">
                            <div className="text-sm text-gray-700">
                              <strong>HTML:</strong> <code>{node.html}</code>
                            </div>
                            {/* <div className="text-sm text-gray-700">
                            <strong>Target:</strong> {node.target?.join(", ")}
                          </div>
                          <div className="text-sm text-gray-700">
                            <strong>Failure Summary:</strong>{" "}
                            {node.failureSummary}
                          </div> */}
                          </div>
                        ))}
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
