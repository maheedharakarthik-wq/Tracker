"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projects as defaultProjects, Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";

export default function Projects() {
  const [projectList, setProjectList] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    async function loadCmsProjects() {
      try {
        const res = await fetch("/api/cms");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            const mapped: Project[] = data.projects.map((p: any) => ({
              id: p.slug || String(p.id),
              title: p.title,
              description: p.description,
              image: p.imageUrl,
              link: p.liveUrl || "#",
              tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : [p.category || "Development"],
            }));
            setProjectList(mapped);
          }
        }
      } catch (e) {
        // Fall back gracefully to static seed data
      }
    }
    loadCmsProjects();
  }, []);

  return (
    <section id="projects" className="py-24 sm:py-32 bg-slate-50 dark:bg-black/40 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[6000ms]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 sm:mb-24 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light"
          >
            Discover how we transform visionary ideas into stunning digital realities.
          </motion.p>
        </div>

        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {projectList.map((project, index) => (
              <CarouselItem key={project.id} className="pl-4 basis-full">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-1 h-full"
                >
                  <Card className="h-full border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden group flex flex-col lg:flex-row p-4 gap-6 rounded-3xl">
                    {/* Image Section - Left Side */}
                    <div className="relative w-full lg:w-[45%] aspect-square overflow-hidden rounded-2xl shrink-0 bg-slate-50 dark:bg-zinc-800/40 flex items-center justify-center">
                        <div className="absolute inset-0 bg-slate-200 dark:bg-zinc-800 animate-pulse" />
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className={`${project.image.includes('thumbnail') ? 'object-cover' : 'object-contain p-8 md:p-12'} transition-transform duration-700 group-hover:scale-105`}
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                        
                        <div className="absolute top-3 right-3 lg:hidden flex flex-wrap gap-2 justify-end">
                            {project.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-white/90 dark:bg-black/90 text-xs backdrop-blur-md shadow-sm">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Content Section - Right Side */}
                    <div className="flex flex-col justify-between w-full lg:w-[55%] py-2 lg:py-4">
                        <div>
                            <div className="hidden lg:flex flex-wrap gap-2 mb-4">
                                {project.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-xs text-slate-700 dark:text-slate-300">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {project.title}
                            </h3>

                            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6 font-normal">
                                {project.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                            {project.link && project.link !== "#" && (
                              <Button asChild className="rounded-full shadow-md bg-blue-600 hover:bg-blue-700 text-white">
                                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                                      Visit Live <ExternalLink className="ml-2 w-4 h-4" />
                                  </a>
                              </Button>
                            )}
                        </div>
                    </div>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-8 pr-4">
             <CarouselPrevious className="static translate-y-0 translate-x-0 border-slate-200 dark:border-white/10" />
             <CarouselNext className="static translate-y-0 translate-x-0 border-slate-200 dark:border-white/10" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
