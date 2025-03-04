import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import fs from "fs"; // Importuojame fs modulį

// Accessibility audit func using axe-core
async function runAccessibilityAudit(url: string): Promise<unknown> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Injecting axe-core script to the page
  await page.addScriptTag({
    url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.3.5/axe.min.js",
  });

  // running axe-core and returning accessibility problems
  const issues = await page.evaluate(async (): Promise<unknown> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (window as any).axe.run();
  });

  await browser.close();
  return issues;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    console.log("Starting accessibility audit for URL:", url);
    const issues = await runAccessibilityAudit(url);

    console.log("issues", issues);
    saveIssuesToFile(issues, `accessibility_issues_${Date.now()}.json`);

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Accessibility audit failed:", error);
    return NextResponse.json(
      { error: "Accessibility audit failed", details: error },
      { status: 500 }
    );
  }
}

const saveIssuesToFile = (
  issues: unknown,
  filename: string = "accessibility_issues.json"
) => {
  const data = JSON.stringify(issues, null, 2);
  fs.writeFileSync(filename, data);
  console.log(`Issues saved to ${filename}`);
};
