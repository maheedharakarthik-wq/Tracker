import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobApplications, jobPostings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, name, email, phone, resumeUrl, portfolioUrl, coverNote } = body;

    if (!name || !email || !phone || !resumeUrl) {
      return NextResponse.json(
        { error: "Name, email, phone, and resume link are required." },
        { status: 400 }
      );
    }

    // Verify job exists if jobId is provided
    let verifiedJobId: number | null = null;
    if (jobId) {
      const parsedId = Number(jobId);
      const [job] = await db.select({ id: jobPostings.id }).from(jobPostings).where(eq(jobPostings.id, parsedId));
      if (job) {
        verifiedJobId = job.id;
      }
    }

    const [application] = await db
      .insert(jobApplications)
      .values({
        jobId: verifiedJobId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        resumeUrl: resumeUrl.trim(),
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : null,
        coverNote: coverNote ? coverNote.trim() : null,
        status: "pending",
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! Our HR team will review it shortly.",
      applicationId: application.id,
    });
  } catch (error) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
