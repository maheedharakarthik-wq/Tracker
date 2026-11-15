"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Mail,
  Rocket,
  TrendingUp,
  Users,
  Sparkles,
  MapPin,
  Clock,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  ExternalLink,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

interface JobPosting {
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
  createdAt: string;
}

export default function Careers() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Application form fields
  const [applicantForm, setApplicantForm] = useState({
    name: "",
    email: "",
    phone: "",
    resumeUrl: "",
    portfolioUrl: "",
    coverNote: "",
  });

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/careers/jobs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.jobs)) {
            setJobs(data.jobs);
          }
        }
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleOpenApply = (job: JobPosting) => {
    setApplyingJob(job);
    setApplicantForm({
      name: "",
      email: "",
      phone: "",
      resumeUrl: "",
      portfolioUrl: "",
      coverNote: "",
    });
    setIsApplyModalOpen(true);
  };

  const handleGeneralApply = () => {
    setApplyingJob(null);
    setApplicantForm({
      name: "",
      email: "",
      phone: "",
      resumeUrl: "",
      portfolioUrl: "",
      coverNote: "",
    });
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantForm.name || !applicantForm.email || !applicantForm.phone || !applicantForm.resumeUrl) {
      toast.error("Please fill in your name, email, phone number, and resume link.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: applyingJob?.id || null,
          ...applicantForm,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Application submitted successfully!");
        setIsApplyModalOpen(false);
      } else {
        toast.error(data.error || "Failed to submit application.");
      }
    } catch {
      toast.error("Network error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = ["all", ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === "all" || job.department === selectedDept;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <main className="flex-grow bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-black border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm font-medium border-blue-100 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 rounded-full"
          >
            <Sparkles className="w-3 h-3 mr-2 fill-current" />
            We are hiring!
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white">
            Build the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Future
            </span>{" "}
            With Us
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join a team of passionate innovators dedicated to transforming the way people learn and grow. We&apos;re looking for big thinkers and doers who want to make a real impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleGeneralApply}
              className="h-12 px-8 text-base rounded-full shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Apply for Open Positions
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base rounded-full border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <Link href="/internship/courses">View Internships</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* LIVE OPEN POSITIONS SECTION */}
      {/* ============================================================== */}
      <section id="openings" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Careers & Opportunities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Explore Open Positions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find your next role in engineering, AI, design, marketing, or human resources.
            </p>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search by title, skill, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-slate-900 text-xs h-10 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* DEPARTMENT PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                selectedDept === dept
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              {dept === "all" ? "All Departments" : dept}
            </button>
          ))}
        </div>

        {/* JOB CARDS GRID */}
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                      {job.department}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {job.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                    {job.experience && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.experience}
                      </span>
                    )}
                  </div>

                  {job.salary && (
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2.5">
                      💰 {job.salary}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mt-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    onClick={() => handleOpenApply(job)}
                    size="sm"
                    className="rounded-xl bg-slate-900 hover:bg-blue-600 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white transition-colors text-xs font-semibold px-4"
                  >
                    Apply Now <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No matching job openings found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We frequently update our career opportunities. You can still submit a general application below.
            </p>
            <Button
              onClick={handleGeneralApply}
              variant="outline"
              size="sm"
              className="mt-4 rounded-full text-xs"
            >
              Submit General Application
            </Button>
          </div>
        )}
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Why Join Us?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">
              We believe in fostering a culture where creativity meets execution. Here&apos;s what makes us different.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-800">
                  <Rocket className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl">Innovation First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We push boundaries and experiment with new technologies. Your ideas matter here, and we give you the freedom to explore them and turn them into reality.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 ring-1 ring-purple-100 dark:ring-purple-800">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl">Continuous Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Learning is part of our DNA. We provide resources, mentorship, and opportunities to upskill yourself every single day, helping you reach your full potential.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader>
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-100 dark:ring-indigo-800">
                  <Users className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl">Collaborative Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We win together. Our diverse team supports one another, ensuring that everyone feels valued and empowered to succeed. Collaboration is key to our success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CANDIDATE APPLICATION MODAL */}
      {/* ============================================================== */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {applyingJob ? `Apply for ${applyingJob.title}` : "Submit General Application"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {applyingJob ? `${applyingJob.department} • ${applyingJob.location}` : "Tell our HR team about your skills and interests."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitApplication} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name *
              </label>
              <Input
                value={applicantForm.name}
                onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                placeholder="e.g. Ananya Sharma"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={applicantForm.email}
                  onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                  placeholder="ananya@gmail.com"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={applicantForm.phone}
                  onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resume / CV Link *
              </label>
              <Input
                type="url"
                value={applicantForm.resumeUrl}
                onChange={(e) => setApplicantForm({ ...applicantForm, resumeUrl: e.target.value })}
                placeholder="Google Drive, Dropbox, or LinkedIn link..."
                required
                className="mt-1"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Please ensure the link permission is set to &ldquo;Anyone with link can view&rdquo;.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Portfolio / GitHub / Website (Optional)
              </label>
              <Input
                type="url"
                value={applicantForm.portfolioUrl}
                onChange={(e) => setApplicantForm({ ...applicantForm, portfolioUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cover Note / Why are you a great fit? (Optional)
              </label>
              <Textarea
                value={applicantForm.coverNote}
                onChange={(e) => setApplicantForm({ ...applicantForm, coverNote: e.target.value })}
                rows={3}
                placeholder="Tell us about your background, relevant projects, and why you want to work with us..."
                className="mt-1"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApplyModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
