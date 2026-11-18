import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. First attempt to load live job postings from Firestore (sync with VMK Tracker Enterprise App)
    try {
      const q = query(
        collection(firestore, "job_postings"),
        where("isActive", "==", true),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreJobs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            slug: data.slug || doc.id,
            department: data.department || "General",
            location: data.location || "Remote",
            type: data.type || "Full-Time",
            experience: data.experience || null,
            salary: data.salary || null,
            description: data.description || "",
            requirements: data.requirements || null,
            responsibilities: data.responsibilities || null,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          };
        });
        return NextResponse.json({ jobs: firestoreJobs });
      }
    } catch (fsErr) {
      console.warn("Firestore fetch notice (falling back to database):", fsErr);
    }

    // 2. Fallback to SQL Database
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

