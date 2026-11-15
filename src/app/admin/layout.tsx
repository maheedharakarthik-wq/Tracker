import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar-aceternity";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  CreditCard,
  TicketPercent,
  Rocket,
  Globe,
  Briefcase,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user.role;

  // Allow both admin and hr access to admin area
  if (role !== "admin" && role !== "hr") {
    redirect("/");
  }

  const isHr = role === "hr";

  // Build links dynamically based on role
  const links = isHr
    ? [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Careers & Jobs",
          href: "/admin/careers",
          icon: <Briefcase className="text-rose-600 dark:text-rose-400 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Internships",
          href: "/admin/internships",
          icon: <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Users & Team",
          href: "/admin/users",
          icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
      ]
    : [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "CMS Landing",
          href: "/admin/cms",
          icon: <Globe className="text-indigo-600 dark:text-indigo-400 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Careers & Jobs",
          href: "/admin/careers",
          icon: <Briefcase className="text-rose-600 dark:text-rose-400 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Pitch2Product",
          href: "/admin/pitch2product",
          icon: <Rocket className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Users & Roles",
          href: "/admin/users",
          icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Internships",
          href: "/admin/internships",
          icon: <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Courses",
          href: "/admin/courses",
          icon: <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Coupons",
          href: "/admin/coupons",
          icon: <TicketPercent className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Enrollments",
          href: "/admin/enrollments",
          icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Payments",
          href: "/admin/payments",
          icon: <CreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
      ];

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-900 w-full flex-1 mx-auto border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
      <Sidebar animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Link href="/" className="flex items-center gap-2 mb-8 px-2 py-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                A
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm truncate">
                  Admin Portal
                </span>
                <span className="text-[10px] text-neutral-400 capitalize">
                  {role === "hr" ? "HR Portal" : "Executive Admin"}
                </span>
              </div>
            </Link>
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Back to Site",
                href: "/",
                icon: (
                  <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700">
        {children}
      </main>
    </div>
  );
}
