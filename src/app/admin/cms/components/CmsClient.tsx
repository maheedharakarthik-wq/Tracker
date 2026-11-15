"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Globe,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Layers,
  Sparkles,
  Star,
  Users2,
  Loader2,
  FolderKanban
} from "lucide-react";
import { toast } from "sonner";
import {
  createCmsProject,
  updateCmsProject,
  deleteCmsProject,
  createCmsPartner,
  updateCmsPartner,
  deleteCmsPartner,
  updateCmsSection,
} from "../actions";

interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
  liveUrl: string | null;
  githubUrl: string | null;
  clientName: string | null;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
}

interface PartnerItem {
  id: number;
  name: string;
  category: string;
  logoUrl: string;
  websiteUrl: string | null;
  industry: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
}

interface SectionItem {
  id: number;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  badgeText: string | null;
  contentJson: any;
  isActive: boolean;
}

interface CmsClientProps {
  initialProjects: ProjectItem[];
  initialPartners: PartnerItem[];
  initialSections: SectionItem[];
}

export function CmsClient({ initialProjects, initialPartners, initialSections }: CmsClientProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [partners, setPartners] = useState<PartnerItem[]>(initialPartners);
  const [sections, setSections] = useState<SectionItem[]>(initialSections);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Web Development",
    description: "",
    imageUrl: "/assets/artgram_thumbnail.png",
    liveUrl: "",
    githubUrl: "",
    clientName: "",
    tags: "Next.js, TypeScript, Tailwind",
    isFeatured: true,
  });

  // Partner form state
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    category: "technical_partner",
    logoUrl: "/assets/nexlytiq.jpg",
    websiteUrl: "",
    industry: "",
    description: "",
  });

  // Filter state
  const [partnerCategoryFilter, setPartnerCategoryFilter] = useState("all");

  // Open Create Project Modal
  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      category: "Web Development",
      description: "",
      imageUrl: "/assets/artgram_thumbnail.png",
      liveUrl: "",
      githubUrl: "",
      clientName: "",
      tags: "Web Design, Next.js, Production",
      isFeatured: true,
    });
    setIsProjectModalOpen(true);
  };

  // Open Edit Project Modal
  const handleOpenEditProject = (p: ProjectItem) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title,
      category: p.category,
      description: p.description,
      imageUrl: p.imageUrl,
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      clientName: p.clientName || "",
      tags: p.tags.join(", "),
      isFeatured: p.isFeatured,
    });
    setIsProjectModalOpen(true);
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description || !projectForm.imageUrl) {
      toast.error("Please fill in the project title, description, and image URL.");
      return;
    }

    setIsSubmitting(true);
    const tagsArray = projectForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingProject) {
        const res = await updateCmsProject(editingProject.id, {
          title: projectForm.title,
          category: projectForm.category,
          description: projectForm.description,
          imageUrl: projectForm.imageUrl,
          liveUrl: projectForm.liveUrl,
          githubUrl: projectForm.githubUrl,
          clientName: projectForm.clientName,
          tags: tagsArray,
          isFeatured: projectForm.isFeatured,
        });
        if (res.project) {
          setProjects(projects.map((p) => (p.id === editingProject.id ? (res.project as ProjectItem) : p)));
          toast.success("Project updated successfully!");
        }
      } else {
        const res = await createCmsProject({
          title: projectForm.title,
          category: projectForm.category,
          description: projectForm.description,
          imageUrl: projectForm.imageUrl,
          liveUrl: projectForm.liveUrl,
          githubUrl: projectForm.githubUrl,
          clientName: projectForm.clientName,
          tags: tagsArray,
          isFeatured: projectForm.isFeatured,
        });
        if (res.project) {
          setProjects([res.project as ProjectItem, ...projects]);
          toast.success("Project added to landing page!");
        }
      }
      setIsProjectModalOpen(false);
    } catch {
      toast.error("Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to remove this project from the home page?")) return;
    try {
      await deleteCmsProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project removed from home page.");
    } catch {
      toast.error("Failed to delete project.");
    }
  };

  // Open Create Partner Modal
  const handleOpenCreatePartner = () => {
    setEditingPartner(null);
    setPartnerForm({
      name: "",
      category: "technical_partner",
      logoUrl: "/assets/nexlytiq.jpg",
      websiteUrl: "",
      industry: "Information Technology",
      description: "",
    });
    setIsPartnerModalOpen(true);
  };

  // Open Edit Partner Modal
  const handleOpenEditPartner = (pt: PartnerItem) => {
    setEditingPartner(pt);
    setPartnerForm({
      name: pt.name,
      category: pt.category,
      logoUrl: pt.logoUrl,
      websiteUrl: pt.websiteUrl || "",
      industry: pt.industry || "",
      description: pt.description || "",
    });
    setIsPartnerModalOpen(true);
  };

  // Save Partner
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.logoUrl) {
      toast.error("Please provide the partner name and logo URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingPartner) {
        const res = await updateCmsPartner(editingPartner.id, {
          name: partnerForm.name,
          category: partnerForm.category,
          logoUrl: partnerForm.logoUrl,
          websiteUrl: partnerForm.websiteUrl,
          industry: partnerForm.industry,
          description: partnerForm.description,
        });
        if (res.partner) {
          setPartners(partners.map((p) => (p.id === editingPartner.id ? (res.partner as PartnerItem) : p)));
          toast.success("Partner updated successfully!");
        }
      } else {
        const res = await createCmsPartner({
          name: partnerForm.name,
          category: partnerForm.category,
          logoUrl: partnerForm.logoUrl,
          websiteUrl: partnerForm.websiteUrl,
          industry: partnerForm.industry,
          description: partnerForm.description,
        });
        if (res.partner) {
          setPartners([res.partner as PartnerItem, ...partners]);
          toast.success("Partner added to landing page!");
        }
      }
      setIsPartnerModalOpen(false);
    } catch {
      toast.error("Failed to save partner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Partner
  const handleDeletePartner = async (id: number) => {
    if (!confirm("Are you sure you want to remove this partner from the home page?")) return;
    try {
      await deleteCmsPartner(id);
      setPartners(partners.filter((p) => p.id !== id));
      toast.success("Partner removed.");
    } catch {
      toast.error("Failed to delete partner.");
    }
  };

  const filteredPartners = partners.filter((pt) => {
    if (partnerCategoryFilter === "all") return true;
    return pt.category === partnerCategoryFilter;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Landing Page CMS
            </h1>
            <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200">
              Live Control
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage projects, technical partners, clients, and homepage sections in real-time.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preview Landing Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </Button>
      </div>

      {/* TABS */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <TabsTrigger value="projects" className="gap-1.5 text-xs font-semibold rounded-lg">
            <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
            Featured Projects ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="partners" className="gap-1.5 text-xs font-semibold rounded-lg">
            <Users2 className="w-3.5 h-3.5 text-emerald-500" />
            Technical Partners & Clients ({partners.length})
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* PROJECTS TAB */}
        {/* ============================================================== */}
        <TabsContent value="projects" className="space-y-6 mt-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Showcased Projects
              </h2>
              <p className="text-xs text-slate-500">
                These projects appear directly in the &ldquo;Featured Projects&rdquo; carousel on the homepage.
              </p>
            </div>
            <Button
              onClick={handleOpenCreateProject}
              size="sm"
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Project</span>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <Card
                key={proj.id}
                className="rounded-xl border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={proj.imageUrl}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-xs backdrop-blur-sm">
                        {proj.category}
                      </span>
                      {proj.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" /> Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {proj.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 line-clamp-2">
                      {proj.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </div>

                <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  {proj.liveUrl ? (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Visit Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Internal Project</span>
                  )}

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-600 hover:text-indigo-600"
                      onClick={() => handleOpenEditProject(proj)}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-rose-600"
                      onClick={() => handleDeleteProject(proj.id)}
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
        {/* PARTNERS TAB */}
        {/* ============================================================== */}
        <TabsContent value="partners" className="space-y-6 mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Technical Partners & Clients
              </h2>
              <p className="text-xs text-slate-500">
                Logos and details displayed in the Technical Partners and Client carousels on the homepage.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={partnerCategoryFilter} onValueChange={setPartnerCategoryFilter}>
                <SelectTrigger className="w-44 h-8 text-xs bg-white dark:bg-slate-900">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical_partner">Technical Partners</SelectItem>
                  <SelectItem value="client">Our Clients</SelectItem>
                  <SelectItem value="digital_client">Digital Clients</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleOpenCreatePartner}
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Partner / Client</span>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPartners.map((pt) => (
              <Card
                key={pt.id}
                className="rounded-xl border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="h-20 w-full relative bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center p-2 mb-3">
                    <Image
                      src={pt.logoUrl}
                      alt={pt.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {pt.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 capitalize"
                    >
                      {pt.category === "technical_partner" ? "Partner" : "Client"}
                    </Badge>
                  </div>
                  {pt.industry && (
                    <div className="text-[10px] text-slate-400 mt-1 truncate">
                      {pt.industry}
                    </div>
                  )}
                  {pt.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {pt.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {pt.websiteUrl ? (
                    <a
                      href={pt.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5"
                    >
                      Website <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400">No URL</span>
                  )}

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-500 hover:text-indigo-600"
                      onClick={() => handleOpenEditPartner(pt)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-rose-600"
                      onClick={() => handleDeletePartner(pt.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ============================================================== */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add Project to Homepage"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProject} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Project Title *
              </label>
              <Input
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="e.g. NextGen FinTech Platform"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category *
                </label>
                <Input
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  placeholder="e.g. Web Development"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Client Name (Optional)
                </label>
                <Input
                  value={projectForm.clientName}
                  onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                  placeholder="e.g. Artgram Studio"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Image Path / URL *
              </label>
              <Input
                value={projectForm.imageUrl}
                onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                placeholder="e.g. /assets/artgram_thumbnail.png"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Live Website URL
                </label>
                <Input
                  value={projectForm.liveUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  GitHub URL (Optional)
                </label>
                <Input
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tech Stack Tags (Comma separated)
              </label>
              <Input
                value={projectForm.tags}
                onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                placeholder="Next.js, TypeScript, PostgreSQL, AI"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Project Description *
              </label>
              <Textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                rows={3}
                placeholder="Describe the solution, features, and business value delivered..."
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFeatured"
                checked={projectForm.isFeatured}
                onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isFeatured" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Mark as Featured Project on homepage
              </label>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProjectModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                {editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PARTNER */}
      {/* ============================================================== */}
      <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Edit Partner / Client" : "Add Partner / Client to Homepage"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePartner} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Organization / Company Name *
              </label>
              <Input
                value={partnerForm.name}
                onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                placeholder="e.g. NexlytiQ Technologies"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category *
                </label>
                <Select
                  value={partnerForm.category}
                  onValueChange={(val) => setPartnerForm({ ...partnerForm, category: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical_partner">Technical Partner</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="digital_client">Digital Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Industry
                </label>
                <Input
                  value={partnerForm.industry}
                  onChange={(e) => setPartnerForm({ ...partnerForm, industry: e.target.value })}
                  placeholder="e.g. EdTech & IT"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Logo URL / Path *
              </label>
              <Input
                value={partnerForm.logoUrl}
                onChange={(e) => setPartnerForm({ ...partnerForm, logoUrl: e.target.value })}
                placeholder="e.g. /assets/nexlytiq.jpg"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Website URL
              </label>
              <Input
                value={partnerForm.websiteUrl}
                onChange={(e) => setPartnerForm({ ...partnerForm, websiteUrl: e.target.value })}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Description (Optional)
              </label>
              <Textarea
                value={partnerForm.description}
                onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })}
                rows={2}
                placeholder="Brief summary of the partnership..."
                className="mt-1"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPartnerModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                {editingPartner ? "Save Changes" : "Add to Homepage"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
