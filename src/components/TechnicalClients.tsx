"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { technicalClients as defaultTechnicalClients, Client } from '../data/clients';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const TechnicalClients = () => {
  const [clientList, setClientList] = useState<Client[]>(defaultTechnicalClients);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  useEffect(() => {
    async function loadCmsPartners() {
      try {
        const res = await fetch("/api/cms");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.partners) && data.partners.length > 0) {
            const technicalOnly = data.partners.filter(
              (p: any) => p.category === "technical_partner"
            );
            if (technicalOnly.length > 0) {
              const mapped: Client[] = technicalOnly.map((p: any) => ({
                id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                name: p.name,
                logo: p.logoUrl,
                industry: p.industry || "Technical Partner",
                description: p.description || "",
                websiteUrl: p.websiteUrl || undefined,
              }));
              setClientList(mapped);
            }
          }
        }
      } catch (e) {
        // Fall back gracefully to static seed data
      }
    }
    loadCmsPartners();
  }, []);

  return (
    <section id="technical-clients" className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">Technical Partners</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Organizations We Serve as a Technical Partner
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Empowering organizations with robust technical partnerships and innovative digital solutions.
          </p>
        </div>

        {clientList.length <= 2 ? (
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {clientList.map((client) => {
              const content = (
                <div
                  className="relative flex items-center justify-center py-10 px-12 bg-white rounded-3xl shadow-xl border-2 border-emerald-200 hover:shadow-2xl hover:border-emerald-400 hover:-translate-y-2 transition-all duration-500 group cursor-pointer overflow-hidden w-full sm:w-auto min-w-[280px] sm:min-w-[340px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                  
                  <div className="relative w-48 h-28 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-center justify-center">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>
              );

              return client.websiteUrl ? (
                <a key={client.id} href={client.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <Link key={client.id} href={`/clients/${client.id}`}>
                  {content}
                </Link>
              );
            })}
          </div>
        ) : (
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full relative"
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            <CarouselContent className="-ml-4">
              {(clientList.length < 4 ? [...clientList, ...clientList, ...clientList] : clientList).map((client, index) => (
                <CarouselItem key={`${client.id}-${index}`} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div
                    className="flex h-full items-center justify-center py-8 px-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative w-32 h-20 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default TechnicalClients;
