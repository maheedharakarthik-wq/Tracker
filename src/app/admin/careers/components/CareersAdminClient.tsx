"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Briefcase,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  Users,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Clock,
  Building,
  MapPin,
  Loader2,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import {
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  updateApplicationStatus,
  deleteApplication,
} from "../actions";

interface JobItem {
  id: number;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string | null;
  salary: string | null;
  description: string;
  requirements: string | null;
  responsibilities: string | null;
  isActive: boolean;
  createdAt: string;
  applicantsCount: number;
}

interface ApplicationItem {
  id: number;
  jobId: number | null;
  jobTitle: string | null;
  department: string | null;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  portfolioUrl: string | null;
  coverNote: string | null;
  status: string;
  createdAt: string;
}

interface CareersAdminClientProps {
  initialJobs: JobItem[];
  initialApplications: ApplicationItem[];
}

export function CareersAdminClient({
  initialJobs,
  initialApplications,
}: CareersAdminClientProps) {
  const [jobs, setJobs] = useState<JobItem[]>(initialJobs);
  const [applications, setApplications] = useState<ApplicationItem[]>(initialApplications);

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null);

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Engineering",
    location: "Remote / Hybrid (Vijayawada)",
    type: "Full-Time",
    experience: "1-3 Years",
    salary: "₹5.0 - ₹8.0 LPA",
    description: "",
    requirements: "",
    responsibilities: "",
    isActive: true,
  });

  // Application Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [appSearch, setAppSearch] = useState("");

  const handleOpenCreateJob = () => {
    setEditingJob(null);
    setJobForm({
      title: "",
      department: "Engineering",
      location: "Remote / Hybrid (Vijayawada)",
      type: "Full-Time",
      experience: "1-3 Years",
      salary: "Competitive",
      description: "",
      requirements: "",
      responsibilities: "",
      isActive: true,
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: JobItem) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience || "",
      salary: job.salary || "",
      description: job.description,
      requirements: job.requirements || "",
      responsibilities: job.responsibilities || "",
      isActive: job.isActive,
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description) {
      toast.error("Please fill in job title and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingJob) {
        const res = await updateJobPosting(editingJob.id, jobForm);
        if (res.job) {
          setJobs(
            jobs.map((j) =>
              j.id === editingJob.id
                ? {
                    ...(res.job as unknown as JobItem),
                    applicantsCount: j.applicantsCount,
                    createdAt: j.createdAt,
                  }
                : j
            )
          );
          toast.success("Job posting updated!");
        }
      } else {
        const res = await createJobPosting(jobForm);
        if (res.job) {
          setJobs([
            {
              ...(res.job as unknown as JobItem),
              applicantsCount: 0,
              createdAt: new Date().toISOString(),
            },
            ...jobs,
          ]);
          toast.success("New job opening published!");
        }
      }
      setIsJobModalOpen(false);
    } catch {
      toast.error("Failed to save job opening.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job posting? All attached applications will be removed.")) return;
    try {
      await deleteJobPosting(id);
      setJobs(jobs.filter((j) => j.id !== id));
      toast.success("Job posting deleted.");
    } catch {
      toast.error("Failed to delete job posting.");
    }
  };

  const handleStatusChange = async (appId: number, newStatus: string) => {
    setUpdatingAppId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(
        applications.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      toast.success(`Candidate status updated to ${newStatus.toUpperCase()}`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleDeleteApplication = async (appId: number) => {
    if (!confirm("Are you sure you want to remove this applicant record?")) return;
    try {
      await deleteApplication(appId);
      setApplications(applications.filter((a) => a.id !== appId));
      toast.success("Application deleted.");
    } catch {
      toast.error("Failed to delete application.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(appSearch.toLowerCase()));

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Careers & Opportunities Portal
            </h1>
            <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200">
              HR Hub
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Post job openings, review candidate resumes, and manage hiring stages.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
          <a href="/careers" target="_blank" rel="noopener noreferrer">
            <Briefcase className="w-3.5 h-3.5 text-rose-600" />
            <span>View Public Careers Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </Button>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <TabsTrigger value="jobs" className="gap-1.5 text-xs font-semibold rounded-lg">
            <Briefcase className="w-3.5 h-3.5 text-rose-500" />
            Open Positions ({jobs.length})
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-1.5 text-xs font-semibold rounded-lg">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            Candidate Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* JOBS TAB */}
        {/* ============================================================== */}
        <TabsContent value="jobs" className="space-y-6 mt-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Company Job Openings
              </h2>
              <p className="text-xs text-slate-500">
                Jobs published here are immediately displayed on the public Careers page.
              </p>
            </div>
            <Button
              onClick={handleOpenCreateJob}
              size="sm"
              className="gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job Opening</span>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="rounded-xl border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">
                      {job.department}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-500" />
                      {job.applicantsCount} applicants
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2.5">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {job.type}
                    </span>
                  </div>

                  {job.salary && (
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                      💰 {job.salary}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mt-3">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-600 hover:text-indigo-600"
                      onClick={() => handleOpenEditJob(job)}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-rose-600"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* APPLICATIONS TAB */}
        {/* ============================================================== */}
        <TabsContent value="applications" className="space-y-6 mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Candidate Applications
              </h2>
              <p className="text-xs text-slate-500">
                Review resumes, contact details, and update hiring stage for candidates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Input
                placeholder="Search candidates..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-48 h-8 text-xs bg-white dark:bg-slate-900"
              />

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-8 text-xs bg-white dark:bg-slate-900">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="rounded-xl border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-10 text-center font-bold text-xs">#</TableHead>
                  <TableHead className="font-semibold text-xs">Candidate</TableHead>
                  <TableHead className="text-xs">Role Applied For</TableHead>
                  <TableHead className="text-xs">Resume & Links</TableHead>
                  <TableHead className="text-xs">Stage</TableHead>
                  <TableHead className="text-right text-xs">Applied Date</TableHead>
                  <TableHead className="pr-6 text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app, index) => (
                  <TableRow key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="text-center font-medium text-xs text-slate-400">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white">
                        {app.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" /> {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {app.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {app.jobTitle || "General Application"}
                      </div>
                      {app.department && (
                        <span className="text-[10px] text-slate-400">{app.department}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold hover:underline"
                          >
                            <FileText className="w-3 h-3" /> View Resume
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">No Resume</span>
                        )}
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-0.5"
                          >
                            Portfolio <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={app.status}
                        onValueChange={(val) => handleStatusChange(app.id, val)}
                        disabled={updatingAppId === app.id}
                      >
                        <SelectTrigger className="h-7 w-28 text-[11px] capitalize bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="interviewed">Interviewed</SelectItem>
                          <SelectItem value="hired" className="text-emerald-600 font-bold">Hired</SelectItem>
                          <SelectItem value="rejected" className="text-rose-600">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-indigo-600">
                          <a href={`mailto:${app.email}?subject=Regarding your application for ${app.jobTitle || 'Role'}`}>
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-rose-600"
                          onClick={() => handleDeleteApplication(app.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredApplications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                      No candidate applications found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================================== */}
      {/* MODAL: POST / EDIT JOB OPENING */}
      {/* ============================================================== */}
      <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? "Edit Job Opening" : "Publish New Job Opening"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveJob} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Job Title *
              </label>
              <Input
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="e.g. Senior Full-Stack Engineer"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Department *
                </label>
                <Select
                  value={jobForm.department}
                  onValueChange={(val) => setJobForm({ ...jobForm, department: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Data & AI">Data & AI</SelectItem>
                    <SelectItem value="Design & Product">Design & Product</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Business Operations">Business Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Employment Type *
                </label>
                <Select
                  value={jobForm.type}
                  onValueChange={(val) => setJobForm({ ...jobForm, type: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Location *
                </label>
                <Input
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="e.g. Remote / Hybrid (Vijayawada)"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Experience Level
                </label>
                <Input
                  value={jobForm.experience}
                  onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                  placeholder="e.g. 1-3 Years / Fresher"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Salary / Compensation Range
              </label>
              <Input
                value={jobForm.salary}
                onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                placeholder="e.g. ₹5.0 - ₹8.0 LPA or Paid Stipend"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Job Overview & Description *
              </label>
              <Textarea
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                rows={3}
                placeholder="Provide a compelling overview of the role, team, and company vision..."
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Key Requirements & Qualifications
              </label>
              <Textarea
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                rows={3}
                placeholder="• Required skills, degrees, languages, or tools..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Key Responsibilities
              </label>
              <Textarea
                value={jobForm.responsibilities}
                onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                rows={3}
                placeholder="• Daily duties, leadership opportunities, and milestones..."
                className="mt-1"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsJobModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 text-white">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                {editingJob ? "Save Changes" : "Publish Job"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
