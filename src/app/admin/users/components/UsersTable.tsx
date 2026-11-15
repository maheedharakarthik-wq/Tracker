"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Search, Filter, Trash2, Loader2, ShieldAlert, UserCheck, Shield, Briefcase, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EnrollAction } from "./EnrollAction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  role: "user" | "intern" | "admin" | "hr" | "employee" | string;
  createdAt: Date;
  isEnrolled: boolean;
  courseName?: string;
  planName?: string;
  enrollmentDate?: Date;
}

interface UsersTableProps {
  initialUsers: User[];
  courses: { id: number; title: string }[];
}

export function UsersTable({ initialUsers, courses }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const filteredUsers = initialUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "enrolled" && user.isEnrolled) ||
      (statusFilter === "not_enrolled" && !user.isEnrolled);

    const matchesRole =
      roleFilter === "all" ||
      user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRoleId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success(`Role updated to ${newRole.toUpperCase()}`);
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update role");
      }
    } catch {
      toast.error("Error updating user role");
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone and will remove all their data.")) {
        return;
    }

    setDeletingId(userId);
    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            toast.success("User deleted successfully");
            router.refresh();
        } else {
            const err = await res.json();
            toast.error(err.error || "Failed to delete user");
        }
    } catch {
        toast.error("Error deleting user");
    } finally {
        setDeletingId(null);
    }
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case "hr":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <UserCheck className="w-3 h-3" /> HR Specialist
          </span>
        );
      case "employee":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Briefcase className="w-3 h-3" /> Employee
          </span>
        );
      case "intern":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <GraduationCap className="w-3 h-3" /> Intern
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Student
          </span>
        );
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              User Registry & Access Roles
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage accounts and grant roles for Admins, HR Specialists, Employees, Interns, and Students.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-56">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search name or email..."
                className="pl-9 bg-white dark:bg-slate-900 h-9 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ROLE FILTER */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-36 bg-white dark:bg-slate-900 h-9 text-xs">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="hr">HR Specialist</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
                <SelectItem value="user">Student (User)</SelectItem>
              </SelectContent>
            </Select>

            {/* STATUS FILTER */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-36 bg-white dark:bg-slate-900 h-9 text-xs">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3 w-3 text-slate-500" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="not_enrolled">Not Enrolled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="w-[40px] pl-6 text-center font-bold text-slate-500 text-xs">#</TableHead>
              <TableHead className="font-semibold text-xs">Name</TableHead>
              <TableHead className="text-xs">Contact Info</TableHead>
              <TableHead className="text-xs">Access Role</TableHead>
              <TableHead className="text-xs">Enrolled?</TableHead>
              <TableHead className="text-xs">Course & Plan</TableHead>
              <TableHead className="text-right text-xs">Joined</TableHead>
              <TableHead className="pr-6 text-right text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                key={user.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <TableCell className="pl-6 text-center text-slate-500 font-medium w-[40px] text-xs">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                      {user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {user.email}
                    </span>
                    {user.phoneNumber && (
                      <span className="text-[11px] text-slate-400">
                        {user.phoneNumber}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* ROLE SWITCHER */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {renderRoleBadge(user.role)}
                    <Select
                      defaultValue={user.role}
                      onValueChange={(val) => handleRoleChange(user.id, val)}
                      disabled={updatingRoleId === user.id}
                    >
                      <SelectTrigger className="h-6 w-20 text-[10px] bg-transparent border-slate-200 dark:border-slate-800 px-1 py-0">
                        <SelectValue placeholder="Change" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user" className="text-xs">Student</SelectItem>
                        <SelectItem value="intern" className="text-xs">Intern</SelectItem>
                        <SelectItem value="employee" className="text-xs">Employee</SelectItem>
                        <SelectItem value="hr" className="text-xs">HR Specialist</SelectItem>
                        <SelectItem value="admin" className="text-xs font-bold text-purple-600">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingRoleId === user.id && (
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {user.isEnrolled ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-600 border-emerald-200 flex w-fit gap-1 items-center text-[10px]"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Yes
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-500 border-slate-200 flex w-fit gap-1 items-center opacity-50 text-[10px]"
                    >
                      <XCircle className="w-3 h-3" /> No
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.isEnrolled ? (
                    <div className="flex flex-col space-y-0.5">
                      <span className="font-medium text-xs text-slate-700 dark:text-slate-200">
                        {user.courseName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {user.planName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-xs font-mono text-slate-500">
                    {format(new Date(user.createdAt), "dd MMM yyyy")}
                  </span>
                </TableCell>
                <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TooltipProvider>
                        {!user.isEnrolled && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span tabIndex={0}>
                                <EnrollAction 
                                    userId={user.id} 
                                    userName={user.name} 
                                    userEmail={user.email} 
                                    courses={courses} 
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enroll User</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                            >
                                {deletingId === user.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete User</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-16 text-slate-500"
                >
                  <p className="text-base font-medium">No users found</p>
                  <p className="text-xs">Try adjusting your search or filters</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
