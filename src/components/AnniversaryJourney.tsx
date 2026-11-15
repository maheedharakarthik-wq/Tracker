"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "@/components/CountUp";
import {
  Calendar,
  Trophy,
  Users,
  HeartHandshake,
  CheckCircle2,
  Rocket,
  ChevronRight,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clients, digitalClients, technicalClients } from "@/data/clients";

// The 4 Quarterly Journey Phases
const timelinePhases = [
  {
    phase: "Q1 • Nov 13, 2025 – Jan 2026",
    title: "Inception & Core Platforms",
    milestone: "Nov 13 Inception",
    description:
      "Incorporated on November 13 with the mission to deliver modern software, scalable web apps, and bespoke technology solutions.",
    highlights: [
      "Official company inception & foundation",
      "Delivered Artgram creative studio platform",
      "Shipped Ruhi Flavours e-commerce portal",
      "Built modern Next.js & cloud infrastructure"
    ],
  },
  {
    phase: "Q2 • Feb 2026 – Apr 2026",
    title: "Community & Mobile Expansion",
    milestone: "App & Temple ERP",
    description:
      "Expanded into spiritual, civic, and community platforms with mobile applications and real-time tracking systems.",
    highlights: [
      "Launched Count HariNams Android application",
      "Engineered Folk Gokula Kshetram temple ERP",
      "Developed VMC smart animal welfare tracking",
      "Conducted developer tech internship cohorts"
    ],
  },
  {
    phase: "Q3 • May 2026 – Jul 2026",
    title: "Enterprise Systems & Alliances",
    milestone: "1st Technical Partner",
    description:
      "Delivered corporate portals across real estate and utilities while inking our first long-term technical partnership.",
    highlights: [
      "Signed 1st Technical Partnership with Quick Property Services",
      "Corporate portals for Magvin Developers & Ask Associates",
      "AquaPuerto RO Purifiers service & AMC system",
      "RCV Fibernet telecommunications & billing portal"
    ],
  },
  {
    phase: "Q4 • Aug 2026 – Nov 13, 2026",
    title: "Marketing & CRM Ecosystems",
    milestone: "1st Anniversary Milestone",
    description:
      "Introduced full-suite Digital Marketing paired with custom CRM dashboards and welcomed our second technical partner.",
    highlights: [
      "Partnered with NexlytiQ Technologies as Technical Partner",
      "Custom CRM & marketing engine for Prime Grandeur",
      "Digital growth for Medha News, LA Bags & Rambha",
      "Celebrated 1-Year Anniversary with 20+ shipped projects"
    ],
  },
];

interface AnniversaryJourneyProps {
  isStandalonePage?: boolean;
}

export default function AnniversaryJourney({ isStandalonePage = false }: AnniversaryJourneyProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "software" | "digital" | "partners">("all");

  const getDisplayClients = () => {
    if (activeCategory === "software") return clients;
    if (activeCategory === "digital") return digitalClients;
    if (activeCategory === "partners") return technicalClients;

    const map = new Map();
    [...technicalClients, ...digitalClients, ...clients].forEach((c) => {
      if (!map.has(c.id)) map.set(c.id, c);
    });
    return Array.from(map.values());
  };

  const displayClients = getDisplayClients();

  const statMetrics = [
    { value: 1, suffix: " Year", label: "Milestone Completed", sub: "Since Nov 13 Inception", icon: Calendar },
    { value: 20, suffix: "+", label: "Projects Delivered", sub: "Web, Mobile & Marketing", icon: Trophy },
    { value: 19, suffix: "+", label: "Trusted Clients", sub: "Across Diverse Industries", icon: Users },
    { value: 2, suffix: "", label: "Technical Partnerships", sub: "Long-Term Alliances", icon: HeartHandshake },
  ];

  const tabs = [
    { id: "all", label: `All Projects (${19})` },
    { id: "software", label: `Software (${clients.length})` },
    { id: "digital", label: `Digital Marketing (${digitalClients.length})` },
    { id: "partners", label: `Technical Partners (${technicalClients.length})` },
  ];

  return (
    <section id="anniversary" className={`${isStandalonePage ? "py-4 sm:py-8" : "py-16 sm:py-24"} bg-white dark:bg-black relative overflow-hidden`}>
      {/* Background decoration matching OurClients / CEOMessage */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-50 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back to Home Button when rendered on dedicated page */}
        {isStandalonePage && (
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </div>
        )}

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#673DE6] dark:text-[#8b65ff] uppercase mb-2 block">
            Company Milestone
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Our 1-Year Journey{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#673DE6]">
              &amp; Projects
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 mx-auto font-light leading-relaxed">
            Founded on <strong>November 13</strong>, VMK Edgemind Solutions has completed its first year of engineering bespoke software, scalable web platforms, and full-funnel digital marketing ecosystems.
          </p>
        </motion.div>

        {/* Milestone Stats Grid (Matching OngoingProjects style) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-24">
          {statMetrics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-slate-900/10 hover:bg-white dark:hover:bg-slate-900/30 hover:border-[#673DE6]/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(103,61,230,0.06)] dark:hover:shadow-none text-center"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 mb-4 rounded-2xl bg-[#673DE6]/10 dark:bg-[#673DE6]/20 flex items-center justify-center text-[#673DE6] dark:text-[#8b65ff] group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.2} />
                </div>
                
                <p className="text-3xl md:text-4xl font-black text-[#673DE6] mb-1 tabular-nums">
                  <CountUp
                    from={0}
                    to={stat.value}
                    separator=","
                    direction="up"
                    duration={1.5}
                  />
                  {stat.suffix}
                </p>
                
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                  {stat.sub}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* 4-Phase Timeline Grid */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center mb-10 sm:mb-14">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Year 1 In Retrospect
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              A quarterly walkthrough of how our services, projects, and partnerships scaled over the last 365 days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {timelinePhases.map((phase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-white dark:hover:bg-slate-900/30 hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    {phase.phase}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {phase.milestone}
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {phase.title}
                </h4>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {phase.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                  {phase.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shipped Projects Showcase */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Projects Shipped in Year 1
              </h3>
              <p className="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                Explore all 20+ delivered solutions across Software, Digital Marketing, and Partnerships.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200/60 dark:border-white/5 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    activeCategory === tab.id
                      ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Client Cards Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          >
            <AnimatePresence>
              {displayClients.map((client) => {
                const isTechnical = technicalClients.some((t) => t.id === client.id);
                const isDigital = digitalClients.some((d) => d.id === client.id);

                return (
                  <motion.div
                    layout
                    key={client.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col p-6 bg-white dark:bg-slate-900/30 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md hover:border-[#673DE6]/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative w-28 h-16 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        {isTechnical && (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 rounded-full">
                            Technical Partner
                          </span>
                        )}
                        {isDigital && !isTechnical && (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 border border-orange-200/50 rounded-full">
                            Marketing & CRM
                          </span>
                        )}
                        {!isDigital && !isTechnical && (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 rounded-full">
                            Software Client
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#673DE6] transition-colors mb-1 line-clamp-1">
                      {client.name}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                      {client.industry}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
                      {client.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 mt-auto flex items-center justify-between">
                      <Link
                        href={`/clients/${client.id}`}
                        className="inline-flex items-center text-xs font-semibold text-[#673DE6] hover:text-[#512bc9] dark:hover:text-[#8b65ff] transition-colors gap-1 group/btn"
                      >
                        <span>View Details</span>
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

        {/* Clean Bottom Card Matching CallToAction / CEOMessage style */}
        <div className="mt-16 text-center max-w-3xl mx-auto p-8 sm:p-10 rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Let&apos;s Build Something Great in Year 2
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
            Join the 19+ organizations that rely on VMK Edgemind Solutions for custom software, web platforms, and full-funnel digital marketing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-2.5 shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <Link href="/contact">Partner With Us</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105"
            >
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
