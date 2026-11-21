import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? (window.location.origin.includes("vmkedgemindsolutions.com") && !window.location.origin.includes("www.")
          ? window.location.origin.replace("://", "://www.")
          : window.location.origin)
      : (process.env.NEXT_PUBLIC_APP_URL || "https://www.vmkedgemindsolutions.com"),
  plugins: [
    inferAdditionalFields<typeof auth>()
  ]
});
