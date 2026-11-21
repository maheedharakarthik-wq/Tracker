import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Adjust path if needed
import { nextCookies } from "better-auth/next-js";

import { users, sessions, accounts, verifications } from "@/db/schema";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_for_dev");

const getBaseURL = () => {
  let url = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    } else {
      url = "https://www.vmkedgemindsolutions.com";
    }
  }
  // Automatically enforce www.vmkedgemindsolutions.com since apex domain has no DNS record
  if (url.includes("vmkedgemindsolutions.com") && !url.includes("www.vmkedgemindsolutions.com")) {
    url = url.replace("vmkedgemindsolutions.com", "www.vmkedgemindsolutions.com");
  }
  return url;
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
    }
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>", // TODO: Update with verified domain
            to: [data.user.email],
            subject: "Reset your password",
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${data.url}">${data.url}</a>`,
        });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
      image: { 
        type: "string", 
        required: false,
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [
    "https://vmkedgemindsolutions.com",
    "https://www.vmkedgemindsolutions.com",
    "http://localhost:3000",
  ],
  plugins: [nextCookies()], 
});
