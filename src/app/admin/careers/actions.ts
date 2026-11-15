"use server";

import { db } from "@/db";
import { jobPostings, jobApplications } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCareersAdminData() {
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
      isActive: jobPostings.isActive,
      createdAt: jobPostings.createdAt,
      applicantsCount: sql<number>`count(${jobApplications.id})`,
    })
    .from(jobPostings)
    .leftJoin(jobApplications, eq(jobApplications.jobId, jobPostings.id))
    .groupBy(jobPostings.id)
    .orderBy(desc(jobPostings.createdAt));

  const applications = await db
    .select({
      id: jobApplications.id,
      jobId: jobApplications.jobId,
      jobTitle: jobPostings.title,
      department: jobPostings.department,
      name: jobApplications.name,
      email: jobApplications.email,
      phone: jobApplications.phone,
      resumeUrl: jobApplications.resumeUrl,
      portfolioUrl: jobApplications.portfolioUrl,
      coverNote: jobApplications.coverNote,
      status: jobApplications.status,
      createdAt: jobApplications.createdAt,
    })
    .from(jobApplications)
    .leftJoin(jobPostings, eq(jobApplications.jobId, jobPostings.id))
    .orderBy(desc(jobApplications.createdAt));

  return {
    jobs: jobs.map((j) => ({
      ...j,
      applicantsCount: Number(j.applicantsCount || 0),
      createdAt: new Date(j.createdAt).toISOString(),
    })),
    applications: applications.map((a) => ({
      ...a,
      createdAt: new Date(a.createdAt).toISOString(),
    })),
  };
}

export async function createJobPosting(data: {
  title: string;
  department: string;
  location: string;
  type: string;
  experience?: string;
  salary?: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  isActive?: boolean;
}) {
  const slug =
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-4)}`;

  const [job] = await db
    .insert(jobPostings)
    .values({
      title: data.title,
      slug,
      department: data.department,
      location: data.location,
      type: data.type,
      experience: data.experience || null,
      salary: data.salary || null,
      description: data.description,
      requirements: data.requirements || null,
      responsibilities: data.responsibilities || null,
      isActive: data.isActive ?? true,
    })
    .returning();

  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  return { success: true, job };
}

export async function updateJobPosting(
  id: number,
  data: Partial<{
    title: string;
    department: string;
    location: string;
    type: string;
    experience?: string;
    salary?: string;
    description: string;
    requirements?: string;
    responsibilities?: string;
    isActive?: boolean;
  }>
) {
  const [updated] = await db
    .update(jobPostings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(jobPostings.id, id))
    .returning();

  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  return { success: true, job: updated };
}

export async function deleteJobPosting(id: number) {
  await db.delete(jobPostings).where(eq(jobPostings.id, id));
  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function updateApplicationStatus(id: number, status: string) {
  const [updated] = await db
    .update(jobApplications)
    .set({ status })
    .where(eq(jobApplications.id, id))
    .returning();

  revalidatePath("/admin/careers");
  return { success: true, application: updated };
}

export async function deleteApplication(id: number) {
  await db.delete(jobApplications).where(eq(jobApplications.id, id));
  revalidatePath("/admin/careers");
  return { success: true };
}
