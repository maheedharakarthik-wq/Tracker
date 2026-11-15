"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, IndianRupee, Trophy, CheckCircle2, XCircle, Clock } from "lucide-react";

interface FinancialMetricsCardProps {
  overview: {
    grossRevenue: number;
    totalPayments: number;
    capturedPayments: number;
    failedPayments: number;
    pendingPayments: number;
    avgOrderValue: number;
    paymentSuccessRate: number;
  };
  topCourses: {
    id: number;
    title: string;
    imageUrl: string | null;
    revenue: number;
    salesCount: number;
  }[];
}

export function FinancialMetricsCard({ overview, topCourses }: FinancialMetricsCardProps) {
  const capturedPct = overview.totalPayments > 0 ? (overview.capturedPayments / overview.totalPayments) * 100 : 0;
  const pendingPct = overview.totalPayments > 0 ? (overview.pendingPayments / overview.totalPayments) * 100 : 0;
  const failedPct = overview.totalPayments > 0 ? (overview.failedPayments / overview.totalPayments) * 100 : 0;

  return (
    <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Financial Intelligence & Top Earners
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 dark:text-indigo-400">
            <Link href="/admin/payments">
              View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        <CardDescription>
          Monetization metrics, payment success rates, and highest grossing courses.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {/* PAYMENT CONVERSION PROGRESS BAR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Payment Settlement Funnel ({overview.totalPayments} transactions)
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {overview.paymentSuccessRate}% success
            </span>
          </div>

          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${capturedPct}%` }}
              title={`Captured: ${overview.capturedPayments}`}
            />
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${pendingPct}%` }}
              title={`Pending: ${overview.pendingPayments}`}
            />
            <div
              className="h-full bg-rose-500 transition-all duration-500"
              style={{ width: `${failedPct}%` }}
              title={`Failed: ${overview.failedPayments}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{overview.capturedPayments} Captured</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{overview.pendingPayments} Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>{overview.failedPayments} Failed</span>
            </div>
          </div>
        </div>

        {/* TOP EARNING COURSES LEADERBOARD */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Top Grossing Courses
          </div>

          {topCourses.length > 0 ? (
            <div className="space-y-2.5">
              {topCourses.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {c.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {c.salesCount} paid enrollments
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      ₹{c.revenue.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Captured
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              No sales recorded for courses yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
