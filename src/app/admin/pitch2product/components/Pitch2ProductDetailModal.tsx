"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  ExternalLink,
  Copy,
  Check,
  Download,
  FileText,
  DollarSign,
  Clock,
  Sparkles,
  Layers,
  TrendingUp,
  Share2,
  ListFilter,
  FileCode,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Pitch2ProductSubmission } from "../types";
import { format } from "date-fns";

interface Pitch2ProductDetailModalProps {
  submission: Pitch2ProductSubmission | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Pitch2ProductDetailModal({
  submission,
  isOpen,
  onClose,
}: Pitch2ProductDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!submission) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyFullSummary = () => {
    const summary = `
=== PITCH2PRODUCT SUBMISSION [${submission.referenceNumber}] ===
Date: ${submission.createdAt ? format(new Date(submission.createdAt), "PPP p") : "N/A"}
Applicant: ${submission.fullName} (${submission.email} | ${submission.phone})
Location: ${submission.city}
Applicant Type: ${submission.applicantType}
${submission.collegeName ? `College: ${submission.collegeName} (${submission.course}, Year ${submission.yearOfStudy})` : ""}
${submission.companyName ? `Company: ${submission.companyName}` : ""}

--- PROJECT ---
Project Name: ${submission.projectName}
Idea Description: ${submission.ideaDescription}
Problem Statement: ${submission.problemStatement || "N/A"}
Target Customer: ${submission.targetCustomer || "N/A"}
Industries: ${submission.industries?.join(", ") || "N/A"}

--- STAGE & TRACTION ---
Current Stage: ${submission.currentStage}
Tech Team: ${submission.technicalTeam || "N/A"}
Users: ${submission.hasUsers === "YES" ? submission.userCount || "Yes" : "No"}
Revenue: ${submission.hasRevenue === "YES" ? submission.revenueRange || "Yes" : "No"}

--- REQUIREMENTS & BUDGET ---
Requirements: ${submission.requirements?.join(", ") || "N/A"}
Timeline: ${submission.timeline || "N/A"}
Budget: ${submission.budget || "N/A"}
Collaboration: ${submission.preferredCollaboration || "N/A"}

--- FILES & LINKS ---
Files Attached: ${submission.files?.length || 0}
${submission.files?.map((f) => `- ${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB): ${f.url}`).join("\n") || "None"}
    `.trim();

    copyToClipboard(summary, "Full Summary");
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submission, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${submission.referenceNumber}_${submission.projectName.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Downloaded submission JSON");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatLabel = (str?: string) => {
    if (!str) return "N/A";
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Section 1: Idea & Vision
  const renderIdeaSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Elevator Pitch / Summary
        </h4>
        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          {submission.ideaDescription || "No elevator pitch provided"}
        </div>
      </div>

      {submission.problemStatement && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Problem Statement
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {submission.problemStatement}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submission.targetCustomer && (
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-1">
            <h5 className="text-xs font-semibold text-slate-500">Target Customer</h5>
            <p className="text-sm text-slate-800 dark:text-slate-200">{submission.targetCustomer}</p>
          </div>
        )}
        {submission.affectedUsers && (
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-1">
            <h5 className="text-xs font-semibold text-slate-500">Affected Users</h5>
            <p className="text-sm text-slate-800 dark:text-slate-200">{submission.affectedUsers}</p>
          </div>
        )}
        {submission.currentSolution && (
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-1">
            <h5 className="text-xs font-semibold text-slate-500">Current Alternative Solution</h5>
            <p className="text-sm text-slate-800 dark:text-slate-200">{submission.currentSolution}</p>
          </div>
        )}
        {submission.differentiator && (
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-1">
            <h5 className="text-xs font-semibold text-slate-500">Key Differentiator</h5>
            <p className="text-sm text-slate-800 dark:text-slate-200">{submission.differentiator}</p>
          </div>
        )}
      </div>

      {submission.industries && submission.industries.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Industries & Domains
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {submission.industries.map((ind) => (
              <Badge
                key={ind}
                variant="secondary"
                className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-normal text-xs"
              >
                {formatLabel(ind)}
              </Badge>
            ))}
            {submission.industryOther && (
              <Badge variant="outline" className="text-xs">
                Other: {submission.industryOther}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Section 2: Applicant Profile
  const renderApplicantSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Contact Details
          </h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 shrink-0">Full Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate">
                {submission.fullName || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 shrink-0">Email</span>
              <div className="flex items-center gap-1.5 max-w-[70%] justify-end">
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate" title={submission.email}>
                  {submission.email || "N/A"}
                </span>
                {submission.email && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-slate-700 shrink-0"
                    onClick={() => copyToClipboard(submission.email, "Email")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 shrink-0">Phone</span>
              <div className="flex items-center gap-1.5 max-w-[70%] justify-end">
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                  {submission.phone || "N/A"}
                </span>
                {submission.phone && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-slate-700 shrink-0"
                    onClick={() => copyToClipboard(submission.phone, "Phone")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 shrink-0">City / Location</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 text-right">
                {submission.city || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            {submission.applicantType === "STUDENT" ? (
              <GraduationCap className="h-3.5 w-3.5" />
            ) : (
              <Building className="h-3.5 w-3.5" />
            )}
            Background & Organization
          </h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 shrink-0">Category</span>
              <Badge variant="outline">{formatLabel(submission.applicantType)}</Badge>
            </div>
            {submission.applicantType === "STUDENT" ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 shrink-0">College</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-right max-w-[200px] truncate" title={submission.collegeName}>
                    {submission.collegeName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Course / Degree</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-right">
                    {submission.course || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Year of Study</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-right">
                    {formatLabel(submission.yearOfStudy)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Student Team Size</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-right">
                    {submission.studentTeamSize || "1"}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500 shrink-0">Company / Startup</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-right">
                  {submission.companyName || "N/A (Individual / Independent)"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profiles & Links */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Online Profiles & Portfolio
        </h4>
        <div className="grid sm:grid-cols-3 gap-3">
          {submission.linkedinUrl ? (
            <a
              href={submission.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">LinkedIn Profile</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          ) : (
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 text-xs text-slate-400">
              No LinkedIn provided
            </div>
          )}

          {submission.profileWebsiteUrl ? (
            <a
              href={submission.profileWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Personal Website</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          ) : (
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 text-xs text-slate-400">
              No Personal Website
            </div>
          )}

          {submission.otherProfileUrl ? (
            <a
              href={submission.otherProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Other Profile</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          ) : (
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 text-xs text-slate-400">
              No Other Profile
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Section 3: Stage & Traction
  const renderTractionSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Product Stage & Development
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Current Stage</span>
              <Badge className="bg-indigo-600 text-white">{formatLabel(submission.currentStage)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Technical Team In-house?</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatLabel(submission.technicalTeam)}
              </span>
            </div>
            {submission.productUrl && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Live Product URL</span>
                <a
                  href={submission.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 hover:underline flex items-center gap-1 text-xs"
                >
                  Visit <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {submission.productDemoUrl && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Demo Video URL</span>
                <a
                  href={submission.productDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 hover:underline flex items-center gap-1 text-xs"
                >
                  Watch <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Market Traction & Metrics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Has Users?</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {submission.hasUsers === "YES" ? `Yes (~${submission.userCount || "0"} users)` : "No"}
              </span>
            </div>
            {submission.monthlyActiveUsers && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Monthly Active Users</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {submission.monthlyActiveUsers}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Has Revenue?</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {submission.hasRevenue === "YES" ? formatLabel(submission.revenueRange) : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Has Outside Investment?</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {submission.hasInvestment === "YES" ? formatLabel(submission.investmentRange) : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Section 4: Needs & Budget
  const renderNeedsSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Required Help & Services
        </h4>
        <div className="flex flex-wrap gap-2">
          {submission.requirements && submission.requirements.length > 0 ? (
            submission.requirements.map((req) => (
              <Badge
                key={req}
                className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 py-1 px-3 text-xs"
              >
                {formatLabel(req)}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-slate-500">No specific requirements checked</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5 text-indigo-500" /> Desired Timeline
          </div>
          <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {formatLabel(submission.timeline)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Budget Range
          </div>
          <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {formatLabel(submission.budget)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Share2 className="h-3.5 w-3.5 text-purple-500" /> Preferred Collaboration
          </div>
          <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {formatLabel(submission.preferredCollaboration)}
          </div>
        </div>
      </div>
    </div>
  );

  // Section 5: Files & External Links
  const renderFilesSection = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Uploaded Pitch Decks & Documents ({submission.files?.length || 0})
        </h4>
        {submission.files && submission.files.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {submission.files.map((file, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between gap-3 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)} • {file.name.split(".").pop()?.toUpperCase()}
                    </p>
                    {file.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                        &quot;{file.description}&quot;
                      </p>
                    )}
                  </div>
                </div>
                {file.url ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    >
                      <Download className="h-3.5 w-3.5" />
                      View / Download File
                    </Button>
                  </a>
                ) : (
                  <Badge variant="secondary" className="w-fit text-xs">
                    Path: {file.path}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
            No files were uploaded with this submission.
          </div>
        )}
      </div>

      {/* External Project Links */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          External Design, Code & Prototype Links
        </h4>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {submission.figmaUrl && (
            <a
              href={submission.figmaUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Figma Designs</span>
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
            </a>
          )}
          {submission.prototypeUrl && (
            <a
              href={submission.prototypeUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clickable Prototype</span>
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
            </a>
          )}
          {submission.githubUrl && (
            <a
              href={submission.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">GitHub Repository</span>
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
            </a>
          )}
          {submission.youtubeUrl && (
            <a
              href={submission.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">YouTube Demo Video</span>
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
            </a>
          )}
          {submission.websiteUrl && (
            <a
              href={submission.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Live Website</span>
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
            </a>
          )}
          {submission.demoUrl && (
            <a
              href={submission.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Demo Link</span>
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
            </a>
          )}
          {submission.otherUrl && (
            <a
              href={submission.otherUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Other Link</span>
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-[95vw] max-h-[92vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {submission.referenceNumber}
                </span>
                <Badge
                  variant="outline"
                  className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs"
                >
                  {formatLabel(submission.applicantType)}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-xs"
                >
                  {formatLabel(submission.currentStage)}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {submission.projectName}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Submitted by <span className="font-medium text-slate-700 dark:text-slate-300">{submission.fullName}</span> on{" "}
                {submission.createdAt
                  ? format(new Date(submission.createdAt), "PPP 'at' p")
                  : "N/A"}
              </DialogDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-8"
                onClick={copyFullSummary}
              >
                {copiedField === "Full Summary" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                )}
                Copy Text Report
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-8"
                onClick={downloadJSON}
              >
                <FileCode className="h-3.5 w-3.5 text-indigo-500" />
                Download JSON
              </Button>

              <a
                href={`mailto:${submission.email}?subject=Regarding your Pitch2Product Submission: ${encodeURIComponent(submission.projectName)} [${submission.referenceNumber}]`}
                target="_blank"
                rel="noreferrer"
              >
                <Button size="sm" className="gap-1.5 text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Mail className="h-3.5 w-3.5" />
                  Reply via Email
                </Button>
              </a>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="shrink-0 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none bg-slate-50/50 dark:bg-slate-900/50">
            <TabsList className="bg-slate-100 dark:bg-slate-800/80 p-1 flex w-max gap-1 shrink-0 h-auto min-h-[38px]">
              <TabsTrigger
                value="all"
                className="gap-1.5 text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white shadow-none"
              >
                <ListFilter className="h-3.5 w-3.5" />
                All Data (Full View)
              </TabsTrigger>
              <TabsTrigger
                value="applicant"
                className="gap-1.5 text-xs px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
              >
                <User className="h-3.5 w-3.5" />
                Applicant Profile
              </TabsTrigger>
              <TabsTrigger
                value="idea"
                className="gap-1.5 text-xs px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Idea & Vision
              </TabsTrigger>
              <TabsTrigger
                value="traction"
                className="gap-1.5 text-xs px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Stage & Traction
              </TabsTrigger>
              <TabsTrigger
                value="needs"
                className="gap-1.5 text-xs px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
              >
                <Layers className="h-3.5 w-3.5" />
                Needs & Budget
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="gap-1.5 text-xs px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
              >
                <FileText className="h-3.5 w-3.5" />
                Files & Links ({submission.files?.length || 0})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 min-h-0 p-6">
            {/* Tab 0: All Details (Full View) */}
            <TabsContent value="all" className="m-0 space-y-8 pb-6">
              {/* Applicant & Contact */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Applicant & Contact Profile
                  </h3>
                </div>
                {renderApplicantSection()}
              </div>

              {/* Idea & Vision */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Idea & Vision
                  </h3>
                </div>
                {renderIdeaSection()}
              </div>

              {/* Stage & Traction */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Stage & Traction
                  </h3>
                </div>
                {renderTractionSection()}
              </div>

              {/* Needs & Budget */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Needs, Timeline & Budget
                  </h3>
                </div>
                {renderNeedsSection()}
              </div>

              {/* Files & Links */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Uploaded Pitch Decks & External Links ({submission.files?.length || 0})
                  </h3>
                </div>
                {renderFilesSection()}
              </div>
            </TabsContent>

            {/* Individual Tab Contents */}
            <TabsContent value="applicant" className="m-0">
              {renderApplicantSection()}
            </TabsContent>

            <TabsContent value="idea" className="m-0">
              {renderIdeaSection()}
            </TabsContent>

            <TabsContent value="traction" className="m-0">
              {renderTractionSection()}
            </TabsContent>

            <TabsContent value="needs" className="m-0">
              {renderNeedsSection()}
            </TabsContent>

            <TabsContent value="files" className="m-0">
              {renderFilesSection()}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
