"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExecutiveHeader } from "./ExecutiveHeader";
import { ExecutiveKpiRibbon } from "./ExecutiveKpiRibbon";
import { LiveActivityFeed } from "./LiveActivityFeed";
import { FinancialMetricsCard } from "./FinancialMetricsCard";
import { LearningEngagementCard } from "./LearningEngagementCard";
import { SystemHealthCard } from "./SystemHealthCard";
import { AdminCharts } from "./AdminCharts";
import { 
  LayoutDashboard, 
  Eye, 
  CreditCard, 
  GraduationCap, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { getExecutiveOverviewData } from "../actions";
import { toast } from "sonner";

interface AdminDashboardClientProps {
  initialData: Awaited<ReturnType<typeof getExecutiveOverviewData>>;
}

export function AdminDashboardClient({ initialData }: AdminDashboardClientProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await getExecutiveOverviewData();
      setData(freshData);
      toast.success("Executive dashboard refreshed with latest telemetry!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh telemetry data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. EXECUTIVE HEADER & PULSE */}
      <ExecutiveHeader
        dbLatencyMs={data.systemDiagnostics.dbLatencyMs}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. EXECUTIVE 5-METRIC KPI RIBBON */}
      <ExecutiveKpiRibbon overview={data.overview} />

      {/* 3. MULTI-PERSPECTIVE DASHBOARD TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <TabsList className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <TabsTrigger
              value="overview"
              className="gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Executive Overview
            </TabsTrigger>
            <TabsTrigger
              value="traffic"
              className="gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              Traffic & Growth
            </TabsTrigger>
            <TabsTrigger
              value="financials"
              className="gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
              Revenue & Monetization
            </TabsTrigger>
          </TabsList>

          <span className="text-xs text-slate-400 hidden sm:inline-block">
            Auto-synced with PostgreSQL & Razorpay
          </span>
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT COLUMN: LIVE ACTIVITY STREAM */}
            <LiveActivityFeed activities={data.recentActivityFeed} />

            {/* RIGHT COLUMN: FINANCIAL HEALTH & EARNERS */}
            <FinancialMetricsCard
              overview={data.overview}
              topCourses={data.topRevenueCourses}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEARNING ENGAGEMENT */}
            <LearningEngagementCard
              overview={data.overview}
              recentEnrollments={data.recentEnrollments}
            />

            {/* SYSTEM INFRASTRUCTURE HEALTH */}
            <SystemHealthCard diagnostics={data.systemDiagnostics} />
          </div>
        </TabsContent>

        {/* TAB 2: WEBSITE TRAFFIC & AUDIENCE */}
        <TabsContent value="traffic" className="space-y-6 mt-0">
          <AdminCharts />
        </TabsContent>

        {/* TAB 3: REVENUE & FINANCIALS */}
        <TabsContent value="financials" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <FinancialMetricsCard
              overview={data.overview}
              topCourses={data.topRevenueCourses}
            />
            <SystemHealthCard diagnostics={data.systemDiagnostics} />
          </div>
          <AdminCharts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
