"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Eye, 
  Rocket, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";

interface ExecutiveKpiRibbonProps {
  overview: {
    totalUsers: number;
    usersByRole: { user: number; intern: number; admin: number };
    totalCourses: number;
    totalEnrollments: number;
    activeEnrollments: number;
    grossRevenue: number;
    totalPayments: number;
    capturedPayments: number;
    failedPayments: number;
    pendingPayments: number;
    avgOrderValue: number;
    paymentSuccessRate: number;
    totalVisits: number;
    todayVisits: number;
    todayUniques: number;
    totalInternships: number;
    totalPitchSubmissions: number;
  };
}

export function ExecutiveKpiRibbon({ overview }: ExecutiveKpiRibbonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. REVENUE */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Gross Revenue
          </CardTitle>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            ₹{overview.grossRevenue.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">
              AOV: <span className="font-semibold text-slate-700 dark:text-slate-300">₹{overview.avgOrderValue.toLocaleString("en-IN")}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              {overview.paymentSuccessRate}% captured
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. USERS */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Users
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {overview.totalUsers.toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">
              {overview.usersByRole.user} Students • {overview.usersByRole.intern} Interns
            </span>
            <span className="inline-flex items-center font-semibold text-blue-600 dark:text-blue-400">
              {overview.usersByRole.admin} Admins
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. ENROLLMENTS */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Enrollments
          </CardTitle>
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {overview.totalEnrollments.toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {overview.activeEnrollments} Active
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {overview.totalCourses} Courses available
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. WEBSITE TRAFFIC */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Platform Traffic
          </CardTitle>
          <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
            <Eye className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {overview.totalVisits.toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              +{overview.todayVisits.toLocaleString()} today
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {overview.todayUniques.toLocaleString()} unique
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 5. INBOUND LEADS & APPLICATIONS */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Applications & Pitches
          </CardTitle>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Rocket className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {(overview.totalPitchSubmissions + overview.totalInternships).toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">
              {overview.totalPitchSubmissions} Startups
            </span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {overview.totalInternships} Intern applicants
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
