// src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    console.error("No URL provided in proxy request");
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  console.log("Fetching URL through proxy:", targetUrl);

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        Accept: "application/xml, text/xml, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
      },
    });

    console.log("Proxy Fetch Status:", response.status);
    console.log("Proxy Fetch Headers:", response.headers);

    if (!response.ok) {
      console.error("Failed to fetch URL:", response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch resource: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "text/html";
    const body = await response.text();

    console.log(
      "Returning response from proxy with content-type:",
      contentType
    );

    return new NextResponse(body, {
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}
