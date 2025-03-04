"use client";

import React, { useState, useEffect } from "react";
import { fetchSitemapUrls } from "@/utils/fetchSitemapUrls";
import { useAuditStore } from "@/store/auditStore";
import { ReportGenerator } from "@/components/ReportGenerator";
import { ViolationsTable } from "@/components/ViolationsTable";
import { saveIssuesToFile } from "@/utils/saveToFile";

const calculateAccessibilityScore = (issues: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  violations: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incomplete: any[];
}): number => {
  let score = 100;
  const impactScores: Record<string, number> = {
    critical: 5,
    serious: 3,
    moderate: 2,
    minor: 1,
  };

  issues.violations.forEach((violation) => {
    const impact = violation.impact || "minor";
    score -= impactScores[impact] || 1;
  });

  return Math.max(0, score); // Ensure score doesn't go below 0
};

const HomePage = () => {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [error, setError] = useState("");
  const { setUrl, setAuditResults, auditResults, currentUrl } = useAuditStore();
  const [overallScore, setOverallScore] = useState(100);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleScan = async () => {
    setScanning(true);
    setScanComplete(false);
    setError("");
    const allScores: number[] = [];

    try {
      const urls = await fetchSitemapUrls(sitemapUrl);
      // const urlsToScan = [urls[0]];

      for (const url of urls) {
        setUrl(url);

        try {
          const response = await fetch(
            `/api/audit?url=${encodeURIComponent(url)}`
          );
          console.log("Audit Response Status:", response.status);

          if (!response.ok) {
            throw new Error(`Failed to audit ${url}: ${response.statusText}`);
          }

          const { issues } = await response.json();
          const score = calculateAccessibilityScore(issues);
          allScores.push(score);

          setAuditResults(url, {
            violations: issues.violations,
            incomplete: issues.incomplete,
            url,
            score,
          });
        } catch (error) {
          console.warn("Accessibility audit failed for ", url, error);
        }
      }

      if (allScores.length > 0) {
        const averageScore =
          allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
        setOverallScore(Math.round(averageScore));
      }

      // saveIssuesToFile(auditResults, `accessibility_issues_${Date.now()}.json`);
    } catch (e) {
      console.error("Failed to fetch sitemap", e);
      // @ts-expect-error todo
      setError(e?.message || "Unknown error");
    } finally {
      setScanning(false);
      setScanComplete(true);
    }
  };
  console.log("auditResults", auditResults);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Accessibility Audit Tool</h1>
      <input
        type="text"
        value={sitemapUrl}
        onChange={(e) => setSitemapUrl(e.target.value)}
        placeholder="Enter Sitemap URL"
        className="p-2 border rounded w-full mb-4"
      />
      <button
        onClick={handleScan}
        disabled={scanning}
        className="p-2 bg-blue-500 text-white rounded"
      >
        {scanning ? "Scanning..." : "Start Scan"}
      </button>
      {error && <p>{error}</p>}

      {scanComplete && auditResults && (
        <div className="mt-4">
          <p className="text-green-500">Scan Complete!</p>
          <p className="text-lg font-bold mb-2">
            Overall Accessibility Score: {overallScore}/100
          </p>
          <div className="w-full bg-gray-200 h-4 rounded">
            <div
              className={`h-4 rounded ${
                overallScore > 80
                  ? "bg-green-500"
                  : overallScore > 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
          {currentUrl && scanning && <p>Scanning: {currentUrl}</p>}
          <ReportGenerator data={auditResults} />
          <ViolationsTable
            violations={Object.values(auditResults).flatMap((result) =>
              result.violations.map((violation) => ({
                ...violation,
                url: result.url,
                score: result.score,
              }))
            )}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
