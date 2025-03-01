"use client";

import React, { useState, useEffect } from "react";
import { fetchSitemapUrls } from "@/utils/fetchSitemapUrls";
import { useAuditStore } from "@/store/auditStore";
import { Overlay } from "@/components/Overlay";
import { ReportGenerator } from "@/components/ReportGenerator";

const HomePage = () => {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const { setUrl, setAuditResults, auditResults, currentUrl } = useAuditStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Add logging to the handleScan function
  const handleScan = async () => {
    setScanning(true);
    setError(""); // Clear previous errors

    try {
      console.log("Starting sitemap scan for URL:", sitemapUrl);
      const urls = await fetchSitemapUrls(sitemapUrl);
      console.log("URLs to scan: ", urls);

      const urlsToScan = [urls[0]]; // Testing only the first URL

      for (const url of urlsToScan) {
        setUrl(url);
        console.log("Scanning URL:", url);

        try {
          const response = await fetch(
            `/api/audit?url=${encodeURIComponent(url)}`
          );
          console.log("Audit Response Status:", response.status);

          if (!response.ok) {
            throw new Error(`Failed to audit ${url}: ${response.statusText}`);
          }

          const { issues } = await response.json();
          console.log("Accessibility Issues: ", issues);
          setAuditResults(url, issues.violations);
        } catch (e) {
          console.warn("Accessibility audit failed for ", url, e);
        }
      }
    } catch (e) {
      console.error("Failed to fetch sitemap", e);
      // @ts-expect-error todo
      setError(e?.message || "Unknown error");
    } finally {
      setScanning(false);
    }
  };

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
      <div className="mt-8">
        {currentUrl && scanning && <p>Scanning: {currentUrl}</p>}
        <Overlay issues={auditResults[currentUrl] || []} />
      </div>

      <ReportGenerator data={auditResults} />
    </div>
  );
};

export default HomePage;
