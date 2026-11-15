"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  UserPlus, 
  TicketPercent, 
  Rocket, 
  Download, 
  RefreshCw, 
  Activity, 
  Database,
  Clock,
  Sparkles,
  Globe,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";

interface ExecutiveHeaderProps {
  dbLatencyMs: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ExecutiveHeader({ dbLatencyMs, onRefresh, isRefreshing }: ExecutiveHeaderProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExportSummary = () => {
    toast.success("Generating executive audit summary...");
    const timestamp = new Date().toISOString().slice(0, 10);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Status,Timestamp\n" +
      `System Health,Operational,${new Date().toISOString()}\n` +
      `Database Latency,${dbLatencyMs}ms,${new Date().toISOString()}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vmk_admin_executive_summary_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Executive summary exported successfully!");
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
      {/* TOP ROW: TITLE & SYSTEM PULSE */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Admin Executive Portal
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live & Operational
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, revenue intelligence, learner progression, and traffic analytics.
          </p>
        </div>

        {/* SYSTEM STATUS RIBBON */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">PostgreSQL:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{dbLatencyMs}ms</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{time || "Loading..."}</span>
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-8 gap-1.5 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSummary}
            className="h-8 gap-1.5 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* QUICK LAUNCH ACTIONS */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
          Quick Launch:
        </span>
        <Button asChild size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs rounded-lg">
          <Link href="/admin/cms">
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            CMS Landing
          </Link>
        </Button>

        <Button asChild size="sm" className="h-8 bg-rose-600 hover:bg-rose-700 text-white shadow-xs rounded-lg">
          <Link href="/admin/careers">
            <Briefcase className="w-3.5 h-3.5 mr-1.5" />
            Careers & Jobs
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 dark:border-slate-700">
          <Link href="/admin/courses/new">
            <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            New Course
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 dark:border-slate-700">
          <Link href="/admin/enroll/new">
            <UserPlus className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            Enroll Student
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 dark:border-slate-700">
          <Link href="/admin/coupons">
            <TicketPercent className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            Coupons
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 dark:border-slate-700">
          <Link href="/admin/pitch2product">
            <Rocket className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
            Pitch2Product
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 dark:border-slate-700">
          <Link href="/admin/internships">
            <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            Internships
          </Link>
        </Button>
      </div>
    </div>
  );
}
