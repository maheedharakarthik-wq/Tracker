import Link from "next/link";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { services } from "@/data/services";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Services({ hideViewAll = false }: { hideViewAll?: boolean }) {
  return (
    <section
      id="services"
      className="dark:bg-black bg-white dark:bg-grid-white/[0.05] bg-grid-black/[0.05] relative"
    >
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-dark dark:text-white">
            Innovative Technology & Growth Solutions
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            From cutting-edge software and IoT to 360° digital marketing and custom CRM dashboards.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {services.map((service) => {
             // Dynamic Icon Rendering
             const IconComponent = (LucideIcons as any)[service.iconName] || LucideIcons.HelpCircle;

             return (
                <CardContainer 
                  key={service.slug} 
                  className="w-full h-full"
                  containerClassName="py-0 w-full h-full"
                >
                  <CardBody className="bg-gray-50/90 hover:bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-brand-purple/[0.1] dark:bg-zinc-950 dark:border-white/[0.1] border-slate-200/80 w-full h-full min-h-[460px] rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md">
                    <div>
                      {/* Top Bar with Icon, Title, and Badge */}
                      <CardItem
                        translateZ="50"
                        className="w-full"
                      >
                        <div className="flex items-start justify-between gap-2 min-h-[56px]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                              <IconComponent className="h-6 w-6 text-brand-purple" />
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                              {service.title}
                            </span>
                          </div>
                          {service.badge && (
                            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border border-orange-200/60 text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap shrink-0 mt-0.5">
                              {service.badge}
                            </Badge>
                          )}
                        </div>
                      </CardItem>

                      {/* Description with fixed uniform height */}
                      <CardItem
                        as="p"
                        translateZ="50"
                        className="text-neutral-500 dark:text-neutral-400 text-sm mt-3 leading-relaxed line-clamp-2 min-h-[40px] flex items-center"
                      >
                        {service.shortDescription}
                      </CardItem>

                      {/* Image */}
                      <CardItem translateZ="60" className="w-full mt-4">
                        <div className="w-full h-[190px] relative rounded-xl overflow-hidden shadow-inner bg-slate-100 dark:bg-zinc-900">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </CardItem>
                    </div>

                    {/* Footer CTA pinned to bottom */}
                    <div className="flex justify-end items-center mt-6 pt-3 border-t border-slate-100 dark:border-white/5">
                      <Link href={`/services/${service.slug}`}>
                        <CardItem
                          translateZ={20}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-purple dark:hover:text-brand-purple transition-colors flex items-center gap-1 group/btn"
                        >
                          <span>Learn more</span>
                          <span className="transition-transform group-hover/btn:translate-x-1 font-bold">→</span>
                        </CardItem>
                      </Link>
                    </div>
                  </CardBody>
                </CardContainer>
             );
          })}
        </div>
      </div>
    </section>
  );
}
