import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { websiteVisits } from "@/db/schema";

function parseDevice(userAgent: string): "desktop" | "mobile" | "tablet" {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer/i.test(
      userAgent
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

function parseBrowser(userAgent: string): string {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/opera|opr/i.test(userAgent)) return "Opera";
  return "Other";
}

const BOT_REGEX =
  /(bot|spider|crawl|slurp|facebookexternalhit|bingpreview|headless|lighthouse|pingdom|googlebot)/i;

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";

    // Ignore known crawlers and bots
    if (BOT_REGEX.test(userAgent)) {
      return NextResponse.json({ skipped: "bot" }, { status: 200 });
    }

    // Ignore Next.js prefetch queries
    if (
      req.headers.get("purpose") === "prefetch" ||
      req.headers.get("x-purpose") === "preview"
    ) {
      return NextResponse.json({ skipped: "prefetch" }, { status: 200 });
    }

    const body = await req.json().catch(() => ({}));
    const rawPath = String(body.path || "/").trim();

    // Ignore internal admin, API and asset paths
    if (
      rawPath.startsWith("/admin") ||
      rawPath.startsWith("/api") ||
      rawPath.startsWith("/_next") ||
      rawPath.startsWith("/assets") ||
      rawPath.includes(".")
    ) {
      return NextResponse.json({ skipped: "internal" }, { status: 200 });
    }

    const path = rawPath.split("?")[0] || "/";
    const visitorId = String(body.visitorId || "").trim() || "anonymous";
    const referrer = String(body.referrer || req.headers.get("referer") || "direct").trim();

    const device = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";

    // Clean referrer: extract domain or mark direct
    let cleanReferrer = "direct";
    if (referrer && referrer !== "direct") {
      try {
        const url = new URL(referrer);
        const host = url.hostname.replace(/^www\./, "");
        // If referrer is the site itself, mark as direct/internal
        if (host.includes("vmkedgemind") || host === "localhost") {
          cleanReferrer = "direct";
        } else {
          cleanReferrer = host;
        }
      } catch {
        cleanReferrer = referrer.slice(0, 50);
      }
    }

    await db.insert(websiteVisits).values({
      path,
      visitorId,
      referrer: cleanReferrer,
      device,
      browser,
      userAgent: userAgent.slice(0, 300),
      ipAddress: ipAddress ? ipAddress.slice(0, 45) : null,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    // Non-blocking: fail quietly so client is never disrupted
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

