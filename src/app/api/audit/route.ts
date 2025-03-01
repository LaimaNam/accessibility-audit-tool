// src/app/api/audit/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

// Accessibility audit funkcija naudojant axe-core
async function runAccessibilityAudit(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Inject axe-core skriptą į puslapį
  await page.addScriptTag({
    url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.3.5/axe.min.js",
  });

  // Vykdome axe-core ir grąžiname accessibility problemas
  const issues = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (window as any).axe.run();
  });

  await browser.close();
  return issues;
}

export async function GET(request: NextRequest) {
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
    // console.log("Accessibility Issues:", issues);
    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Accessibility audit failed:", error);
    return NextResponse.json(
      { error: "Accessibility audit failed", details: error },
      { status: 500 }
    );
  }
}
