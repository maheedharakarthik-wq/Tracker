"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Award, Users, ArrowUpRight, GraduationCap } from "lucide-react";

interface LearningEngagementCardProps {
  overview: {
    totalEnrollments: number;
    activeEnrollments: number;
    completedLessons: number;
    quizAttempts: number;
    avgQuizScore: number;
  };
  recentEnrollments: {
    id: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    userName: string | null;
    userEmail: string | null;
    courseTitle: string | null;
    planTitle: string | null;
  }[];
}

export function LearningEngagementCard({ overview, recentEnrollments }: LearningEngagementCardProps) {
  const activeRate =
    overview.totalEnrollments > 0
      ? Math.round((overview.activeEnrollments / overview.totalEnrollments) * 100)
      : 0;

  return (
    <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Student Engagement & Course Progress
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 dark:text-indigo-400">
            <Link href="/admin/enrollments">
              View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        <CardDescription>
          Curriculum milestone completions, quiz accuracy, and active learning subscriptions.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {/* ENGAGEMENT STATS STRIP */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-950/40 text-center">
            <div className="flex justify-center mb-1 text-emerald-500">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Lessons Done</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {overview.completedLessons.toLocaleString()}
            </div>
          </div>

          <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-950/40 text-center">
            <div className="flex justify-center mb-1 text-indigo-500">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Quiz Attempts</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {overview.quizAttempts.toLocaleString()}
            </div>
          </div>

          <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-950/40 text-center">
            <div className="flex justify-center mb-1 text-purple-500">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Active Rate</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {activeRate}%
            </div>
          </div>
        </div>

        {/* RECENT ENROLLMENTS LIST */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recent Course Enrollments
          </div>

          {recentEnrollments.length > 0 ? (
            <div className="space-y-2.5">
              {recentEnrollments.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {e.userName || "Student"}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {e.courseTitle || "Course"} {e.planTitle ? `• ${e.planTitle}` : ""}
                    </div>
                  </div>

                  <div className="shrink-0 ml-3 text-right">
                    <Badge
                      variant="outline"
                      className={
                        e.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px]"
                          : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 text-[10px]"
                      }
                    >
                      {e.isActive ? "Active" : "Expired"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              No recent enrollments recorded.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
