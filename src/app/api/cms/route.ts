import { NextResponse } from "next/server";
import { db } from "@/db";
import { cmsProjects, cmsPartners, cmsSections } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await db
      .select()
      .from(cmsProjects)
      .where(eq(cmsProjects.isPublished, true))
      .orderBy(asc(cmsProjects.displayOrder), desc(cmsProjects.createdAt));

    const partners = await db
      .select()
      .from(cmsPartners)
      .where(eq(cmsPartners.isActive, true))
      .orderBy(asc(cmsPartners.displayOrder), desc(cmsPartners.createdAt));

    const sections = await db.select().from(cmsSections);

    return NextResponse.json({
      projects,
      partners,
      sections,
    });
  } catch (error) {
    console.error("Error fetching public CMS data:", error);
    return NextResponse.json({ error: "Failed to fetch CMS data" }, { status: 500 });
  }
}
