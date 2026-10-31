import { services } from "@/data/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Phone, Sparkles, PhoneCall, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const IconComponent = (LucideIcons as any)[service.iconName] || LucideIcons.HelpCircle;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black font-sans text-slate-800 dark:text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
          <Image 
            src={service.image} 
            alt={service.title} 
            fill 
            className="object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <Link href="/services" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Services
          </Link>
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
                <IconComponent className="w-8 h-8 text-brand-purple" />
              </div>
              {service.badge && (
                <Badge className="bg-gradient-to-r from-orange-500 to-rose-500 text-white border-none text-xs font-semibold px-3 py-1 shadow-md">
                  {service.badge}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
              {service.shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#673DE6] hover:bg-[#5832c9] text-white rounded-full px-8 shadow-lg font-semibold">
                <Link href="/contact">Book Free Consultation</Link>
              </Button>
              <Button asChild size="lg" className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/60 font-semibold rounded-full px-7 backdrop-blur-md shadow-md transition-all">
                <a href="tel:+918686854024" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-300" />
                  <span>+91 8686854024</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Overview */}
      <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Description */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-brand-purple mb-2 block">
                Comprehensive Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                About the Service
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {service.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Key Deliverables & Features
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-zinc-900/60 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-brand-purple/40 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
                    <span className="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual/Image Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/30 to-pink-500/20 rounded-3xl transform rotate-2 scale-105 opacity-30 blur-2xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[500px]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Special Feature: CRM Dashboard Highlight (If applicable) */}
      {service.crmHighlight && (
        <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Proprietary Advantage
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                {service.crmHighlight.title}
              </h2>
              <p className="text-lg text-purple-300 font-medium mb-3">
                {service.crmHighlight.tagline}
              </p>
              <p className="text-slate-300 text-base leading-relaxed">
                {service.crmHighlight.description}
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Benefits list */}
              <div className="lg:col-span-6 space-y-4">
                {service.crmHighlight.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mock CRM Dashboard Widget */}
              <div className="lg:col-span-6">
                <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-purple-500/30 shadow-2xl backdrop-blur-xl">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm font-bold text-white tracking-wide">Live CRM Dashboard</span>
                    </div>
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full font-medium">
                      Real-time Sync
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Leads</p>
                      <p className="text-2xl font-black text-white mt-1">1,482</p>
                      <span className="text-[10px] text-emerald-400 font-medium">↑ 24% this month</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Contacted</p>
                      <p className="text-2xl font-black text-white mt-1">94.8%</p>
                      <span className="text-[10px] text-purple-400 font-medium">Avg &lt; 5 mins</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Conversions</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">328</p>
                      <span className="text-[10px] text-slate-400 font-medium">Closed deals</span>
                    </div>
                  </div>

                  {/* Pipeline Stage Preview */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Sales Pipeline Stages
                    </p>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                      <span className="text-slate-300">📥 New Meta & Google Leads</span>
                      <span className="font-bold text-white bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">64 New</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                      <span className="text-slate-300">📞 Telecaller In-Followup</span>
                      <span className="font-bold text-white bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">42 Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                      <span className="text-slate-300">🤝 Appointment / Visit Booked</span>
                      <span className="font-bold text-white bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">28 Scheduled</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                      <span className="text-slate-300">✅ Won & Converted</span>
                      <span className="font-bold text-white bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">19 Converted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Detailed Sub-Services Grid (If present) */}
      {service.subServices && service.subServices.length > 0 && (
        <section className="py-20 sm:py-28 container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-purple mb-2 block">
              End-to-End Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              All Services Included
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Every critical marketing and conversion capability required to dominate your local and digital market.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {service.subServices.map((sub, idx) => {
              const SubIcon = (LucideIcons as any)[sub.iconName || "Sparkles"] || LucideIcons.Sparkles;
              return (
                <div 
                  key={idx}
                  className="flex flex-col p-6 rounded-3xl bg-slate-50/90 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-white/5 hover:border-brand-purple/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-5 group-hover:scale-110 transition-transform">
                    <SubIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug min-h-[52px] flex items-center">
                    {sub.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-grow min-h-[56px] line-clamp-3">
                    {sub.description}
                  </p>

                  {sub.features && (
                    <ul className="space-y-1.5 pt-3 border-t border-slate-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 mt-auto">
                      {sub.features.map((item, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Call to Action Banner */}
      <section className="pb-20 container mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#673DE6] via-indigo-700 to-blue-700 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-900/30 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

          <div className="max-w-2xl relative z-10">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 text-white tracking-tight">
              Ready to Accelerate Your Business Growth?
            </h3>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed font-normal">
              Connect with our team today to get a customized strategy for software, digital marketing, and dedicated CRM integration.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0 relative z-10">
            <Button asChild size="lg" className="bg-white text-[#673DE6] hover:bg-slate-100 font-bold rounded-full px-8 h-12 shadow-xl hover:shadow-2xl transition-all">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white/90 bg-white/15 text-white hover:bg-white hover:text-[#673DE6] font-semibold rounded-full px-7 h-12 backdrop-blur-md transition-all shadow-md">
              <a href="tel:+918686854024" className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
