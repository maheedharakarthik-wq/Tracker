"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  BookOpen, 
  UserPlus, 
  Briefcase, 
  Activity, 
  ArrowRight,
  ExternalLink
} from "lucide-react";
import type { ExecutiveActivityItem } from "../actions";

interface LiveActivityFeedProps {
  activities: ExecutiveActivityItem[];
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
  const getIcon = (type: ExecutiveActivityItem["type"]) => {
    switch (type) {
      case "payment":
        return (
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      case "enrollment":
        return (
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
        );
      case "signup":
        return (
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case "internship":
        return (
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            <Briefcase className="w-4 h-4" />
          </div>
        );
    }
  };

  const getStatusBadge = (activity: ExecutiveActivityItem) => {
    if (activity.type === "payment") {
      const isSuccess = activity.status === "captured";
      return (
        <Badge
          variant="outline"
          className={
            isSuccess
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px]"
              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 text-[10px]"
          }
        >
          {activity.status}
        </Badge>
      );
    }

    if (activity.type === "enrollment") {
      return (
        <Badge
          variant="outline"
          className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 text-[10px]"
        >
          {activity.status || "active"}
        </Badge>
      );
    }

    if (activity.type === "signup") {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 text-[10px] capitalize"
        >
          {activity.status || "user"}
        </Badge>
      );
    }

    return null;
  };

  return (
    <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Live Platform Audit Stream
          </CardTitle>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Feed
          </span>
        </div>
        <CardDescription>
          Real-time stream of student payments, course enrollments, signups, and internship leads.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3 flex-1 flex flex-col justify-between">
        {activities.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activities.map((act) => (
              <Link
                key={act.id}
                href={act.href}
                className="group flex items-start justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="shrink-0 mt-0.5">{getIcon(act.type)}</div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {act.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {formatRelativeTime(act.date)}
                  </span>
                  {getStatusBadge(act)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-slate-400">
            No recent platform activity recorded.
          </div>
        )}

        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">Showing recent 10 events</span>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 dark:text-indigo-400">
              <Link href="/admin/payments">
                Payments <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 dark:text-indigo-400">
              <Link href="/admin/enrollments">
                Enrollments <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
