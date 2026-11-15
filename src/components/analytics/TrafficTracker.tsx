"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let vid = localStorage.getItem("vmk_vid");
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem("vmk_vid", vid);
    }
    return vid;
  } catch {
    return "anon_" + Math.random().toString(36).substring(2, 10);
  }
}

export function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Exclude admin and internal paths
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next")
    ) {
      return;
    }

    const fullPath = searchParams && searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Prevent duplicate triggers for the exact same path in one session
    if (lastTrackedPath.current === fullPath) return;
    lastTrackedPath.current = fullPath;

    const visitorId = getVisitorId();
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    const payload = JSON.stringify({
      path: pathname,
      fullPath,
      referrer,
      visitorId,
    });

    // Send via sendBeacon if supported, otherwise fetch with keepalive
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    // Also trigger Google Analytics pageview if gtag is available
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

