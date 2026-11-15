"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Rocket,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Award,
  Zap,
  HeartHandshake,
  Laptop,
  Megaphone,
  Briefcase,
  ChevronRight,
  Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clients, digitalClients, technicalClients } from "@/data/clients";

// Quarter / Phase milestones for Year 1
const journeyMilestones = [
  {
    phase: "Phase 1: Inception & Digital Genesis",
    period: "Nov 13, 2025 – Jan 2026",
    title: "Laying the Groundwork",
    highlight: "Official Company Inception (Nov 13)",
    description:
      "Founded with a bold mission to provide bespoke, enterprise-grade software and tech solutions to emerging businesses. Rolled out our first landmark client platforms.",
    achievements: [
      "Inception & incorporation of VMK Edgemind Solutions on Nov 13",
      "Delivered Artgram creative studio & event management web platform",
      "Built Ruhi Flavours artisan food e-commerce portal",
      "Setup robust cloud hosting and modern Next.js tech stack"
    ],
    accentColor: "from-amber-500/20 to-orange-500/10",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Rocket
  },
  {
    phase: "Phase 2: Civic, Devotional & Community Impact",
    period: "Feb 2026 – Apr 2026",
    title: "Expanding Across Sectors",
    highlight: "Mobile Apps & Temple ERP Systems",
    description:
      "Engineered specialized civic, spiritual, and student-focused platforms, expanding our technological capabilities from web to mobile applications and IoT monitoring.",
    achievements: [
      "Launched Count HariNams Android App with real-time devotional tracking & leaderboards",
      "Engineered Folk Gokula Kshetram comprehensive temple management system",
      "Developed VMC smart animal welfare & tracking system",
      "Initiated hands-on developer internship & training programs"
    ],
    accentColor: "from-blue-500/20 to-indigo-500/10",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Users
  },
  {
    phase: "Phase 3: Real Estate, Infrastructure & 1st Technical Partnership",
    period: "May 2026 – Jul 2026",
    title: "Enterprise Scaling & Partnerships",
    highlight: "1st Strategic Technical Partnership",
    description:
      "Entered the real estate, utility, and telecommunications sectors with large-scale web platforms, CRM systems, and inked our first official technical partner agreement.",
    achievements: [
      "Forged official Technical Partnership with Quick Property Services",
      "Delivered corporate portals for Magvin Developers & Ask Associates",
      "Built AquaPuerto RO Purifiers service & AMC management system",
      "Engineered RCV Fibernet telecommunications & billing platform"
    ],
    accentColor: "from-emerald-500/20 to-teal-500/10",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: HeartHandshake
  },
  {
    phase: "Phase 4: 360° Digital Marketing, Custom CRMs & 2nd Strategic Alliance",
    period: "Aug 2026 – Nov 13, 2026",
    title: "Full-Funnel Growth & 1-Year Milestone",
    highlight: "1st Anniversary & 20+ Projects",
    description:
      "Expanded our offerings to full-suite Digital Marketing backed by proprietary custom CRM dashboards. Forged our second technical partnership and crossed 20+ successful projects.",
    achievements: [
      "Partnered with NexlytiQ Technologies as technical & digital growth partners",
      "Built custom lead tracking CRM and marketing engine for Prime Constructions",
      "Executed viral digital marketing for Medha Digital Telugu News, LA Bags & Rambha Fashions",
      "Celebrated our monumental 1st Year Anniversary with 19+ trusted clients"
    ],
    accentColor: "from-purple-500/20 to-pink-500/10",
    badgeColor: "bg-purple-500/10 text-[#673DE6] dark:text-[#8b65ff] border-[#673DE6]/20",
    icon: Trophy
  }
];

export default function AnniversaryJourney() {
  const [activeCategory, setActiveCategory] = useState<"all" | "software" | "digital" | "partners">("all");

  // Filter projects according to category
  const getDisplayClients = () => {
    if (activeCategory === "software") return clients;
    if (activeCategory === "digital") return digitalClients;
    if (activeCategory === "partners") return technicalClients;

    // All unique clients combined
    const map = new Map();
    [...technicalClients, ...digitalClients, ...clients].forEach((c) => {
      if (!map.has(c.id)) map.set(c.id, c);
    });
    return Array.from(map.values());
  };

  const displayClients = getDisplayClients();

  return (
    <section id="anniversary" className="py-20 md:py-32 relative overflow-hidden bg-slate-50/60 dark:bg-black/60">
      {/* Decorative background glow elements */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-[#673DE6]/10 dark:bg-[#673DE6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          {/* Anniversary Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-blue-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-5 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
            <span>Celebrating 1 Year of Innovation • Inception Nov 13</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            Our 1-Year Journey:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-[#673DE6] to-blue-600">
              From Vision to 20+ Projects
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Founded on <strong>November 13, 2025</strong>, VMK Edgemind Solutions has completed 365 days of transforming bold ideas into high-impact software, scalable web platforms, custom CRM dashboards, and strategic technical partnerships.
          </p>
        </motion.div>

        {/* 1st Year Key Milestone Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20 md:mb-28">
          {[
            { value: "1 Year", label: "Milestone Completed", sub: "Since Nov 13 Inception", icon: Calendar, color: "text-amber-500 bg-amber-500/10" },
            { value: "20+", label: "Projects Delivered", sub: "Web, Mobile, IoT & Ads", icon: Trophy, color: "text-[#673DE6] bg-[#673DE6]/10" },
            { value: "19+", label: "Trusted Clients", sub: "Across Diverse Industries", icon: Users, color: "text-blue-500 bg-blue-500/10" },
            { value: "2", label: "Technical Partnerships", sub: "Long-term Strategic Alliances", icon: HeartHandshake, color: "text-emerald-500 bg-emerald-500/10" },
          ].map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/80 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${metric.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                  {metric.value}
                </p>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-0.5">
                  {metric.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {metric.sub}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* The 4-Phase Timeline: Year 1 In Retrospect */}
        <div className="mb-24 md:mb-32">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-bold tracking-widest text-[#673DE6] dark:text-[#8b65ff] uppercase mb-2 block">
              Quarter-by-Quarter
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              How We Built Our First Year
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Every quarter brought new capabilities, ambitious client challenges, and technological breakthroughs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {journeyMilestones.map((milestone, idx) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex flex-col p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Subtle corner gradient */}
                  <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${milestone.accentColor} rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
                    <Badge variant="outline" className={`${milestone.badgeColor} font-semibold text-xs px-3 py-1 rounded-full`}>
                      {milestone.period}
                    </Badge>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {milestone.highlight}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-800 dark:text-white shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {milestone.title}
                    </h4>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 relative z-10">
                    {milestone.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 space-y-2.5 relative z-10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      Key Highlights:
                    </p>
                    {milestone.achievements.map((item, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Project Showcase: All Year 1 Projects */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase mb-2 block">
                Portfolio of Year 1
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Projects Shipped in 365 Days
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
                Explore the organizations, apps, and digital campaigns we launched during our inaugural year.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 w-fit">
              {[
                { id: "all", label: `All (${19})` },
                { id: "software", label: `Software (${clients.length})` },
                { id: "digital", label: `Marketing (${digitalClients.length})` },
                { id: "partners", label: `Partners (${technicalClients.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeCategory === tab.id
                      ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {displayClients.map((client) => {
                const isTechnical = technicalClients.some((t) => t.id === client.id);
                const isDigital = digitalClients.some((d) => d.id === client.id);

                return (
                  <motion.div
                    layout
                    key={client.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/5 hover:border-[#673DE6]/40 hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Top: Logo & Badge */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="relative w-20 h-14 bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-2 border border-slate-100 dark:border-white/5 flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {isTechnical && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5">
                            Technical Partner
                          </Badge>
                        )}
                        {isDigital && (
                          <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[10px] font-bold px-2 py-0.5">
                            Marketing & CRM
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 leading-snug line-clamp-1">
                      {client.name}
                    </h4>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                      {client.industry}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6 flex-grow">
                      {client.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 mt-auto flex items-center justify-between">
                      <Link
                        href={`/clients/${client.id}`}
                        className="inline-flex items-center text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-[#673DE6] dark:hover:text-[#8b65ff] transition-colors gap-1 group/btn"
                      >
                        <span>View Deliverables</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>

                      {client.websiteUrl && (
                        <a
                          href={client.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                          title="Visit Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Celebratory Banner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-8 sm:p-12 md:p-14 rounded-3xl bg-gradient-to-r from-amber-500 via-[#673DE6] to-indigo-700 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-2xl relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Here&apos;s to Year 2 & Beyond
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight">
              Ready to Build Your Next Big Milestone With Us?
            </h3>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed font-light">
              As we step into our second year, we are expanding our engineering team, launching specialized AI workflows, and welcoming ambitious brands for software development, technical partnerships, and growth marketing.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0 relative z-10">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full px-8 h-12 shadow-xl hover:shadow-2xl transition-all">
              <Link href="/contact">Partner With Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white/90 bg-white/15 text-white hover:bg-white hover:text-slate-900 font-semibold rounded-full px-7 h-12 backdrop-blur-md transition-all shadow-md">
              <Link href="/services">Explore All Services</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
