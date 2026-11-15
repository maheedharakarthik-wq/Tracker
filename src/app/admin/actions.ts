"use server";

import { db } from "@/db";
import {
  payments,
  enrollments,
  courses,
  websiteVisits,
  users,
  coursePlans,
  internshipRegistrations,
  userProgress,
} from "@/db/schema";
import { sql, eq, and, gte, desc, count } from "drizzle-orm";

export type Period = "daily" | "weekly" | "monthly" | "yearly" | "all";

export async function getAdminChartData(period: Period) {
  const now = new Date();
  let startDate: Date;
  let truncType = "day";

  // Determine date range and trunc granularity
  switch (period) {
    case "daily":
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
      truncType = "day";
      break;
    case "weekly":
      startDate = new Date();
      startDate.setDate(now.getDate() - 90); // ~12 weeks
      truncType = "week";
      break;
    case "monthly":
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1); // 12 months
      truncType = "month";
      break;
    case "yearly":
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 5); // 5 years
      truncType = "year";
      break;
    case "all":
      startDate = new Date(0); // Beginning of time
      truncType = "month";
      break;
  }

  // --- REVENUE CHART DATA ---
  const revenueData = await db
    .select({
      date: sql<Date>`date_trunc(${truncType}, ${payments.createdAt})`,
      amount: sql<number>`sum(${payments.amount}) / 100`, // Convert paise to rupees
    })
    .from(payments)
    .where(and(eq(payments.status, "captured"), gte(payments.createdAt, startDate)))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // --- ENROLLMENT OVER TIME ---
  const enrollmentData = await db
    .select({
      date: sql<Date>`date_trunc(${truncType}, ${enrollments.createdAt})`,
      count: sql<number>`count(*)`,
    })
    .from(enrollments)
    .where(gte(enrollments.createdAt, startDate))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // --- COURSE DISTRIBUTION ---
  const courseDistribution = await db
    .select({
      name: courses.title,
      count: sql<number>`count(${enrollments.id})`,
    })
    .from(enrollments)
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .where(gte(enrollments.createdAt, startDate))
    .groupBy(courses.id, courses.title)
    .orderBy(sql`count(${enrollments.id}) DESC`);

  // --- WEBSITE TRAFFIC OVER TIME (Day, Week, Month, Year) ---
  const trafficData = await db
    .select({
      date: sql<Date>`date_trunc(${truncType}, ${websiteVisits.createdAt})`,
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // --- TOP VISITED PAGES ---
  const topPagesData = await db
    .select({
      path: websiteVisits.path,
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate))
    .groupBy(websiteVisits.path)
    .orderBy(sql`count(*) DESC`)
    .limit(10);

  // --- TRAFFIC SOURCES (REFERRERS) ---
  const topReferrersData = await db
    .select({
      name: websiteVisits.referrer,
      count: sql<number>`count(*)`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate))
    .groupBy(websiteVisits.referrer)
    .orderBy(sql`count(*) DESC`)
    .limit(6);

  // --- DEVICE BREAKDOWN ---
  const devicesData = await db
    .select({
      device: websiteVisits.device,
      count: sql<number>`count(*)`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate))
    .groupBy(websiteVisits.device)
    .orderBy(sql`count(*) DESC`);

  // --- SUMMARY KPI METRICS ---
  // Today's midnight
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Week start (Monday)
  const weekStart = new Date(now);
  const dayOfWeek = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  // Month start
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  // Year start
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [todayStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, todayStart));

  const [weekStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, weekStart));

  const [monthStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, monthStart));

  const [yearStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, yearStart));

  const [periodTotals] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate));

  const [allTimeStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits);

  const totalPeriodViews = Number(periodTotals?.views || 0);

  return {
    revenue: revenueData.map((d) => ({
      ...d,
      date: new Date(d.date).toISOString(),
      amount: Number(d.amount),
    })),
    enrollments: enrollmentData.map((d) => ({
      ...d,
      date: new Date(d.date).toISOString(),
      count: Number(d.count),
    })),
    distribution: courseDistribution.map((d) => ({
      ...d,
      count: Number(d.count),
      fill:
        "var(--color-" +
        (d.name || "Unknown").replace(/[^a-zA-Z0-9]/g, "") +
        ")",
    })),
    traffic: {
      timeline: trafficData.map((d) => ({
        date: new Date(d.date).toISOString(),
        views: Number(d.views),
        uniques: Number(d.uniques),
      })),
      topPages: topPagesData.map((p) => ({
        path: p.path,
        views: Number(p.views),
        uniques: Number(p.uniques),
        percentage:
          totalPeriodViews > 0
            ? Math.round((Number(p.views) / totalPeriodViews) * 100)
            : 0,
      })),
      topReferrers: topReferrersData.map((r) => ({
        name: r.name || "Direct",
        count: Number(r.count),
      })),
      devices: devicesData.map((dev) => ({
        device: dev.device ? dev.device.charAt(0).toUpperCase() + dev.device.slice(1) : "Desktop",
        count: Number(dev.count),
      })),
      summary: {
        periodViews: totalPeriodViews,
        periodUniques: Number(periodTotals?.uniques || 0),
        todayViews: Number(todayStats?.views || 0),
        todayUniques: Number(todayStats?.uniques || 0),
        weekViews: Number(weekStats?.views || 0),
        weekUniques: Number(weekStats?.uniques || 0),
        monthViews: Number(monthStats?.views || 0),
        monthUniques: Number(monthStats?.uniques || 0),
        yearViews: Number(yearStats?.views || 0),
        yearUniques: Number(yearStats?.uniques || 0),
        allTimeViews: Number(allTimeStats?.views || 0),
        allTimeUniques: Number(allTimeStats?.uniques || 0),
      },
    },
  };
}

export type ExecutiveActivityItem = {
  id: string;
  type: "payment" | "enrollment" | "signup" | "internship";
  title: string;
  subtitle: string;
  amount?: number;
  status?: string;
  date: string;
  href: string;
};

export async function getExecutiveOverviewData() {
  const startTime = Date.now();
  const now = new Date();

  // Test DB latency
  try {
    await db.execute(sql`SELECT 1`);
  } catch (e) {
    console.error("DB Ping error:", e);
  }
  const dbLatencyMs = Math.max(1, Date.now() - startTime);

  // 1. Users & Roles
  const [totalUsersRes] = await db.select({ value: count() }).from(users);
  const roleBreakdownRes = await db
    .select({
      role: users.role,
      count: count(),
    })
    .from(users)
    .groupBy(users.role);

  const rolesMap = { user: 0, intern: 0, admin: 0 };
  roleBreakdownRes.forEach((r) => {
    if (r.role in rolesMap) {
      rolesMap[r.role as keyof typeof rolesMap] = Number(r.count);
    }
  });

  // 2. Courses
  const [totalCoursesRes] = await db.select({ value: count() }).from(courses);

  // 3. Enrollments (Total & Active)
  const [totalEnrollmentsRes] = await db.select({ value: count() }).from(enrollments);
  const [activeEnrollmentsRes] = await db
    .select({ value: count() })
    .from(enrollments)
    .where(and(eq(enrollments.isActive, true), gte(enrollments.endDate, now)));

  // 4. Financials / Payments
  const [grossRevenueRes] = await db
    .select({
      total: sql<number>`coalesce(sum(${payments.amount}), 0) / 100`,
    })
    .from(payments)
    .where(eq(payments.status, "captured"));

  const [paymentCountsRes] = await db
    .select({
      total: count(),
      captured: sql<number>`count(*) filter (where ${payments.status} = 'captured')`,
      failed: sql<number>`count(*) filter (where ${payments.status} = 'failed')`,
      pending: sql<number>`count(*) filter (where ${payments.status} in ('created', 'authorized'))`,
    })
    .from(payments);

  const totalCaptured = Number(paymentCountsRes?.captured || 0);
  const grossRevenue = Number(grossRevenueRes?.total || 0);
  const avgOrderValue = totalCaptured > 0 ? Math.round(grossRevenue / totalCaptured) : 0;
  const paymentSuccessRate =
    Number(paymentCountsRes?.total || 0) > 0
      ? Math.round((totalCaptured / Number(paymentCountsRes?.total || 1)) * 100)
      : 100;

  // 5. Website Visits (All time & Today)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [totalVisitsRes] = await db.select({ value: count() }).from(websiteVisits);
  const [todayVisitsRes] = await db
    .select({
      views: count(),
      uniques: sql<number>`count(distinct ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, todayStart));

  // 6. Internship Registrations
  const [totalInternshipsRes] = await db.select({ value: count() }).from(internshipRegistrations);

  // 7. Pitch2Product (Firestore, safe try/catch)
  let totalPitchSubmissions = 0;
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const adminDb = getAdminDb();
    const snap = await adminDb.collection("pitch2productSubmissions").count().get();
    totalPitchSubmissions = snap.data().count;
  } catch {
    totalPitchSubmissions = 0;
  }

  // 8. Learning Engagement (userProgress)
  const [progressStats] = await db
    .select({
      completedLessons: sql<number>`count(*) filter (where ${userProgress.isCompleted} = true)`,
      quizAttempts: sql<number>`count(*) filter (where ${userProgress.attempts} > 0)`,
      avgScore: sql<number>`coalesce(avg(${userProgress.score}), 0)`,
    })
    .from(userProgress);

  // 9. Top Revenue Generating Courses
  const topRevenueCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      imageUrl: courses.imageUrl,
      revenue: sql<number>`coalesce(sum(${payments.amount}), 0) / 100`,
      salesCount: count(payments.id),
    })
    .from(courses)
    .leftJoin(payments, and(eq(payments.courseId, courses.id), eq(payments.status, "captured")))
    .groupBy(courses.id, courses.title, courses.imageUrl)
    .orderBy(sql`sum(${payments.amount}) DESC NULLS LAST`)
    .limit(5);

  // 10. Recent Payments (Latest 6)
  const recentPayments = await db
    .select({
      id: payments.id,
      paymentId: payments.paymentId,
      amount: sql<number>`${payments.amount} / 100`,
      status: payments.status,
      date: payments.createdAt,
      userName: users.name,
      userEmail: users.email,
      courseTitle: courses.title,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .leftJoin(courses, eq(payments.courseId, courses.id))
    .orderBy(desc(payments.createdAt))
    .limit(6);

  // 11. Recent Enrollments (Latest 6)
  const recentEnrollments = await db
    .select({
      id: enrollments.id,
      startDate: enrollments.startDate,
      endDate: enrollments.endDate,
      isActive: enrollments.isActive,
      userName: users.name,
      userEmail: users.email,
      courseTitle: courses.title,
      planTitle: coursePlans.title,
    })
    .from(enrollments)
    .leftJoin(users, eq(enrollments.userId, users.id))
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .leftJoin(coursePlans, eq(enrollments.planId, coursePlans.id))
    .orderBy(desc(enrollments.createdAt))
    .limit(6);

  // 12. Recent Signups (Latest 5)
  const recentSignups = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(5);

  // 13. Recent Internships (Latest 5)
  const recentInternships = await db
    .select({
      id: internshipRegistrations.id,
      name: internshipRegistrations.name,
      email: internshipRegistrations.email,
      college: internshipRegistrations.college,
      year: internshipRegistrations.year,
      duration: internshipRegistrations.internshipDuration,
      createdAt: internshipRegistrations.createdAt,
    })
    .from(internshipRegistrations)
    .orderBy(desc(internshipRegistrations.createdAt))
    .limit(5);

  // 14. Compile Unified Real-Time Activity Feed
  const feed: ExecutiveActivityItem[] = [];

  recentPayments.forEach((p) => {
    feed.push({
      id: `pay-${p.id}`,
      type: "payment",
      title: p.userName
        ? `${p.userName} paid ₹${Number(p.amount).toLocaleString()}`
        : `Payment of ₹${Number(p.amount).toLocaleString()}`,
      subtitle: p.courseTitle ? `For "${p.courseTitle}"` : `Order #${p.paymentId.slice(-8)}`,
      amount: Number(p.amount),
      status: p.status,
      date: new Date(p.date).toISOString(),
      href: "/admin/payments",
    });
  });

  recentEnrollments.forEach((e) => {
    feed.push({
      id: `enr-${e.id}`,
      type: "enrollment",
      title: `${e.userName || "Student"} enrolled in course`,
      subtitle: e.courseTitle || "New Enrollment",
      status: e.isActive ? "active" : "expired",
      date: new Date(e.startDate).toISOString(),
      href: "/admin/enrollments",
    });
  });

  recentSignups.forEach((u) => {
    feed.push({
      id: `usr-${u.id}`,
      type: "signup",
      title: `New user joined: ${u.name}`,
      subtitle: `${u.email} (${u.role})`,
      status: u.role,
      date: new Date(u.createdAt).toISOString(),
      href: "/admin/users",
    });
  });

  recentInternships.forEach((i) => {
    feed.push({
      id: `int-${i.id}`,
      type: "internship",
      title: `Internship Application: ${i.name}`,
      subtitle: `${i.college} • ${i.duration}`,
      date: new Date(i.createdAt).toISOString(),
      href: "/admin/internships",
    });
  });

  feed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const topFeed = feed.slice(0, 10);

  return {
    overview: {
      totalUsers: Number(totalUsersRes.value || 0),
      usersByRole: rolesMap,
      totalCourses: Number(totalCoursesRes.value || 0),
      totalEnrollments: Number(totalEnrollmentsRes.value || 0),
      activeEnrollments: Number(activeEnrollmentsRes.value || 0),
      grossRevenue,
      totalPayments: Number(paymentCountsRes?.total || 0),
      capturedPayments: totalCaptured,
      failedPayments: Number(paymentCountsRes?.failed || 0),
      pendingPayments: Number(paymentCountsRes?.pending || 0),
      avgOrderValue,
      paymentSuccessRate,
      totalVisits: Number(totalVisitsRes.value || 0),
      todayVisits: Number(todayVisitsRes?.views || 0),
      todayUniques: Number(todayVisitsRes?.uniques || 0),
      totalInternships: Number(totalInternshipsRes.value || 0),
      totalPitchSubmissions,
      completedLessons: Number(progressStats?.completedLessons || 0),
      quizAttempts: Number(progressStats?.quizAttempts || 0),
      avgQuizScore: Math.round(Number(progressStats?.avgScore || 0)),
    },
    topRevenueCourses: topRevenueCourses.map((c) => ({
      ...c,
      revenue: Number(c.revenue || 0),
      salesCount: Number(c.salesCount || 0),
    })),
    recentPayments: recentPayments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      date: new Date(p.date).toISOString(),
    })),
    recentEnrollments: recentEnrollments.map((e) => ({
      ...e,
      startDate: new Date(e.startDate).toISOString(),
      endDate: new Date(e.endDate).toISOString(),
    })),
    recentActivityFeed: topFeed,
    systemDiagnostics: {
      dbLatencyMs,
      environment: process.env.NODE_ENV || "production",
      serverTimestamp: new Date().toISOString(),
      status: "operational" as const,
    },
  };
}
