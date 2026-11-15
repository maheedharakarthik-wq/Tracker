import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await db
      .select({
        id: jobPostings.id,
        title: jobPostings.title,
        slug: jobPostings.slug,
        department: jobPostings.department,
        location: jobPostings.location,
        type: jobPostings.type,
        experience: jobPostings.experience,
        salary: jobPostings.salary,
        description: jobPostings.description,
        requirements: jobPostings.requirements,
        responsibilities: jobPostings.responsibilities,
        createdAt: jobPostings.createdAt,
      })
      .from(jobPostings)
      .where(eq(jobPostings.isActive, true))
      .orderBy(desc(jobPostings.createdAt));

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
