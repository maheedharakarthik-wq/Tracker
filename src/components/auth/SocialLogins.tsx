"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SocialLogins() {
  const [isLoading, setIsLoading] = useState(false);

  const oauthSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err: any) {
      console.error("Google sign in error:", err);
      toast.error(err?.message || "Failed to initiate Google sign in.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center">
      <Button
        variant="outline"
        className="w-full relative"
        onClick={oauthSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-slate-500" />
        ) : (
          <FaGoogle className="mr-2 h-4 w-4 text-rose-500" />
        )}
        <span>{isLoading ? "Connecting to Google..." : "Sign in with Google"}</span>
      </Button>
    </div>
  );
}
