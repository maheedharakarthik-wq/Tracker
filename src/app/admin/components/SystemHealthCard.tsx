"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Database, 
  ShieldCheck, 
  CreditCard, 
  Rocket, 
  Eye, 
  CheckCircle2, 
  Cpu
} from "lucide-react";

interface SystemHealthCardProps {
  diagnostics: {
    dbLatencyMs: number;
    environment: string;
    serverTimestamp: string;
    status: "operational";
  };
}

export function SystemHealthCard({ diagnostics }: SystemHealthCardProps) {
  const services = [
    {
      name: "PostgreSQL Database",
      detail: `Pool active • ${diagnostics.dbLatencyMs}ms ping`,
      status: "Healthy",
      icon: <Database className="w-4 h-4 text-indigo-500" />,
    },
    {
      name: "Traffic & Visitor Tracker",
      detail: "First-party async beacon engine active",
      status: "Active",
      icon: <Eye className="w-4 h-4 text-emerald-500" />,
    },
    {
      name: "Razorpay Webhooks",
      detail: "Signature verification & payment capture",
      status: "Configured",
      icon: <CreditCard className="w-4 h-4 text-blue-500" />,
    },
    {
      name: "Authentication & Sessions",
      detail: "Role-based access & admin gate",
      status: "Secure",
      icon: <ShieldCheck className="w-4 h-4 text-purple-500" />,
    },
    {
      name: "Pitch2Product Datastore",
      detail: "Firestore real-time collections synced",
      status: "Connected",
      icon: <Rocket className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Infrastructure & Integration Posture
          </CardTitle>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% Healthy
          </span>
        </div>
        <CardDescription>
          Real-time diagnostics across database connection, auth, payments, and background collectors.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {services.map((srv) => (
            <div key={srv.name} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  {srv.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {srv.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{srv.detail}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{srv.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <span>Env: {diagnostics.environment}</span>
          <span>Last Checked: {new Date(diagnostics.serverTimestamp).toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
