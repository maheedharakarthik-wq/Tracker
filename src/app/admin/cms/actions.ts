"use server";

import { db } from "@/db";
import { cmsProjects, cmsPartners, cmsSections } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCmsData() {
  const projects = await db
    .select()
    .from(cmsProjects)
    .orderBy(asc(cmsProjects.displayOrder), desc(cmsProjects.createdAt));

  const partners = await db
    .select()
    .from(cmsPartners)
    .orderBy(asc(cmsPartners.displayOrder), desc(cmsPartners.createdAt));

  const sections = await db.select().from(cmsSections);

  return { projects, partners, sections };
}

export async function createCmsProject(data: {
  title: string;
  slug?: string;
  description: string;
  category: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  clientName?: string;
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
}) {
  const slug =
    data.slug?.trim() ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-4)}`;

  const [project] = await db
    .insert(cmsProjects)
    .values({
      title: data.title,
      slug,
      description: data.description,
      category: data.category || "Web Development",
      imageUrl: data.imageUrl,
      liveUrl: data.liveUrl || null,
      githubUrl: data.githubUrl || null,
      clientName: data.clientName || null,
      tags: data.tags || [],
      isFeatured: data.isFeatured ?? true,
      isPublished: data.isPublished ?? true,
      displayOrder: 0,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/cms");
  return { success: true, project };
}

export async function updateCmsProject(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    liveUrl?: string;
    githubUrl?: string;
    clientName?: string;
    tags?: string[];
    isFeatured?: boolean;
    isPublished?: boolean;
  }>
) {
  const [updated] = await db
    .update(cmsProjects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(cmsProjects.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/cms");
  return { success: true, project: updated };
}

export async function deleteCmsProject(id: number) {
  await db.delete(cmsProjects).where(eq(cmsProjects.id, id));
  revalidatePath("/");
  revalidatePath("/admin/cms");
  return { success: true };
}

export async function createCmsPartner(data: {
  name: string;
  category: string;
  logoUrl: string;
  websiteUrl?: string;
  industry?: string;
  description?: string;
}) {
  const [partner] = await db
    .insert(cmsPartners)
    .values({
      name: data.name,
      category: data.category || "technical_partner",
      logoUrl: data.logoUrl,
      websiteUrl: data.websiteUrl || null,
      industry: data.industry || null,
      description: data.description || null,
      isActive: true,
      displayOrder: 0,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/cms");
  return { success: true, partner };
}

export async function updateCmsPartner(
  id: number,
  data: Partial<{
    name: string;
    category: string;
    logoUrl: string;
    websiteUrl?: string;
    industry?: string;
    description?: string;
    isActive?: boolean;
  }>
) {
  const [updated] = await db
    .update(cmsPartners)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(cmsPartners.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/cms");
  return { success: true, partner: updated };
}

export async function deleteCmsPartner(id: number) {
  await db.delete(cmsPartners).where(eq(cmsPartners.id, id));
  revalidatePath("/");
  revalidatePath("/admin/cms");
  return { success: true };
}

export async function updateCmsSection(
  sectionKey: string,
  data: {
    title?: string;
    subtitle?: string;
    badgeText?: string;
    contentJson?: Record<string, any>;
  }
) {
  const [updated] = await db
    .insert(cmsSections)
    .values({
      sectionKey,
      title: data.title || null,
      subtitle: data.subtitle || null,
      badgeText: data.badgeText || null,
      contentJson: data.contentJson || {},
      isActive: true,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: cmsSections.sectionKey,
      set: {
        title: data.title,
        subtitle: data.subtitle,
        badgeText: data.badgeText,
        contentJson: data.contentJson,
        updatedAt: new Date(),
      },
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/cms");
  return { success: true, section: updated };
}
