import axios from "axios";

export async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  console.log("Fetching sitemap from URL:", sitemapUrl);
  try {
    const encodedUrl = encodeURIComponent(sitemapUrl);
    console.log("Encoded URL ---->", encodedUrl);

    const response = await axios.get(`/api/proxy?url=${encodedUrl}`);

    // console.log("Proxy Response Status:", response.status);
    // console.log("Proxy Response Headers:", response.headers);
    // console.log("Proxy Response Data:", response.data);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "application/xml");

    const urls = Array.from(xmlDoc.getElementsByTagName("loc")).map(
      (element) => element.textContent || ""
    );

    // console.log("Parsed URLs from Sitemap:", urls);

    return urls.filter(Boolean);
  } catch (e) {
    console.error("Failed to fetch sitemap", e);
    throw new Error("Failed to fetch sitemap");
  }
}
