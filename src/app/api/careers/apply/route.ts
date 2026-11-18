import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobApplications, jobPostings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";

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

    // 1. Sync candidate application directly into Firestore (VMK Tracker Enterprise App)
    let firestoreAppId: string | null = null;
    try {
      const docRef = await addDoc(collection(firestore, "job_applications"), {
        jobId: jobId ? String(jobId) : null,
        jobTitle: body.jobTitle || "Open Position",
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        resumeUrl: resumeUrl.trim(),
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : null,
        coverNote: coverNote ? coverNote.trim() : null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      firestoreAppId = docRef.id;

      if (jobId) {
        try {
          await updateDoc(doc(firestore, "job_postings", String(jobId)), {
            applicantsCount: increment(1),
          });
        } catch (_) {}
      }
    } catch (fsErr) {
      console.warn("Firestore sync notice (fallback to DB only):", fsErr);
    }

    // 2. Also save to SQL Database if configured
    let verifiedJobId: number | null = null;
    let dbAppId: number | null = null;
    try {
      if (jobId && !isNaN(Number(jobId))) {
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
      dbAppId = application.id;
    } catch (dbErr) {
      console.warn("SQL DB insert notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! Our HR team will review it shortly.",
      applicationId: firestoreAppId || dbAppId,
    });
  } catch (error) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}

