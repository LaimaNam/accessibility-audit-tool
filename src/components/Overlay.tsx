import React, { useEffect, useState } from "react";

interface Violation {
  impact?: string;
  description?: string;
  target?: string[];
  help?: string;
  helpUrl?: string;
  html?: string;
}

interface AuditResult {
  url: string;
  violations: Violation[];
  incomplete: Violation[];
  score?: number;
}

interface OverlayProps {
  allResults: Record<string, AuditResult>;
}

export const Overlay: React.FC<OverlayProps> = ({ allResults }) => {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [activeViolation, setActiveViolation] = useState<Violation | null>(
    null
  );
  console.log("allResults", allResults);

  const handleShowDetails = (url: string, violation: Violation) => {
    setActiveUrl(url);
    setActiveViolation(violation);
  };

  const handleCloseDetails = () => {
    setActiveUrl(null);
    setActiveViolation(null);
  };

  useEffect(() => {
    if (activeViolation?.target) {
      activeViolation.target.forEach((selector) => {
        if (typeof selector === "string") {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            (element as HTMLElement).style.border = "2px solid red";
            (element as HTMLElement).style.backgroundColor =
              "rgba(255, 0, 0, 0.1)";
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }
      });
    }

    return () => {
      document.querySelectorAll("*").forEach((element) => {
        (element as HTMLElement).style.border = "";
        (element as HTMLElement).style.backgroundColor = "";
      });
    };
  }, [activeViolation]);

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(allResults).map(([url, result]) => (
        <div key={url} className="flex flex-col gap-1">
          <p className="font-bold">{url}</p>
          <p className="text-sm">
            Score: <span className="font-bold">{result.score}/100</span>
          </p>
          <div>
            {result.violations.map((violation, index) => (
              <div key={index} className="flex">
                <span
                  className={`font-bold ${
                    violation.impact === "critical" ||
                    violation.impact === "serious"
                      ? "text-red"
                      : " text-emerald-950"
                  }`}
                >
                  {violation.impact}:
                </span>
                <a
                  key={index}
                  onClick={() => handleShowDetails(url, violation)}
                  className="text-blue-500 underline ml-2"
                >
                  {violation.description}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}

      {activeViolation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-3/4 h-3/4 overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
              onClick={handleCloseDetails}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">Issue in: {activeUrl}</h2>
            <p>
              <strong>Impact:</strong> {activeViolation.impact}
            </p>
            <p>
              <strong>Message:</strong> {activeViolation.description}
            </p>
            {activeViolation.helpUrl && (
              <p>
                <strong>Help:</strong>{" "}
                <a
                  href={activeViolation.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {activeViolation.help}
                </a>
              </p>
            )}
            <p>
              <strong>HTML:</strong>{" "}
              <code className="bg-gray-200 p-1 rounded">
                {activeViolation.html}
              </code>
            </p>
            <p>
              <strong>Target Elements:</strong>
            </p>
            <ul>
              {activeViolation.target?.map((selector, index) => (
                <li key={index} className="text-sm bg-gray-100 p-1 rounded">
                  {selector}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
