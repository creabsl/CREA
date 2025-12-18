import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import Spinner from "./Spinner";
import { getAllMemberships } from "../services/api";
import type { Membership } from "../types";

export default function MembershipsAdmin() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMemberships();
      setMemberships(data || []);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch memberships"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredMemberships = useMemo(() => {
    return memberships
      .filter((m) => {
        const matchesStatus =
          filterStatus === "all" || m.status === filterStatus;
        const matchesType = filterType === "all" || m.type === filterType;
        const matchesSearch =
          !searchQuery ||
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.membershipId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.mobile.includes(searchQuery);

        return matchesStatus && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        // Sort by type: Lifetime first, then Ordinary
        if (a.type === "lifetime" && b.type === "ordinary") return -1;
        if (a.type === "ordinary" && b.type === "lifetime") return 1;
        // Then sort by creation date (newest first)
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [memberships, filterStatus, filterType, searchQuery]);

  const exportToCSV = () => {
    const headers = [
      "Membership ID",
      "Date Created",
      "Name",
      "Email",
      "Mobile",
      "Date of Birth",
      "Designation",
      "Division",
      "Department",
      "Place",
      "Unit",
      "Type",
      "Status",
      "Payment Amount",
      "Payment Status",
      "Payment Method",
      "Payment Date",
      "Valid From",
      "Valid Until",
      "Gender",
      "Address",
      "City",
      "State",
      "Pincode",
      "Employee ID",
      "Joining Date",
      "Experience",
      "Specialization",
    ];

    const rows = filteredMemberships.map((m) => [
      m.membershipId || "",
      new Date(m.createdAt).toLocaleDateString(),
      m.name,
      m.email,
      m.mobile,
      m.personalDetails?.dateOfBirth
        ? new Date(m.personalDetails.dateOfBirth).toLocaleDateString()
        : "",
      m.designation,
      m.division,
      m.department,
      m.place || "",
      m.unit || "",
      m.type,
      m.status,
      m.paymentAmount,
      m.paymentStatus,
      m.paymentMethod,
      m.paymentDate ? new Date(m.paymentDate).toLocaleDateString() : "",
      m.validFrom ? new Date(m.validFrom).toLocaleDateString() : "",
      m.validUntil ? new Date(m.validUntil).toLocaleDateString() : "",
      m.personalDetails?.gender || "",
      m.personalDetails?.address || "",
      m.personalDetails?.city || "",
      m.personalDetails?.state || "",
      m.personalDetails?.pincode || "",
      m.professionalDetails?.employeeId || "",
      m.professionalDetails?.joiningDate || "",
      m.professionalDetails?.experience || "",
      m.professionalDetails?.specialization || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `memberships_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const headers = [
      "Membership ID",
      "Date Created",
      "Name",
      "Email",
      "Mobile",
      "Date of Birth",
      "Designation",
      "Division",
      "Department",
      "Place",
      "Unit",
      "Type",
      "Status",
      "Payment Amount",
      "Payment Status",
      "Payment Method",
      "Payment Date",
      "Valid From",
      "Valid Until",
      "Gender",
      "Address",
      "City",
      "State",
      "Pincode",
      "Employee ID",
      "Joining Date",
      "Experience",
      "Specialization",
    ];

    const rows = filteredMemberships.map((m) => [
      m.membershipId || "",
      new Date(m.createdAt).toLocaleDateString(),
      m.name,
      m.email,
      m.mobile,
      m.personalDetails?.dateOfBirth
        ? new Date(m.personalDetails.dateOfBirth).toLocaleDateString()
        : "",
      m.designation,
      m.division,
      m.department,
      m.place || "",
      m.unit || "",
      m.type,
      m.status,
      m.paymentAmount,
      m.paymentStatus,
      m.paymentMethod,
      m.paymentDate ? new Date(m.paymentDate).toLocaleDateString() : "",
      m.validFrom ? new Date(m.validFrom).toLocaleDateString() : "",
      m.validUntil ? new Date(m.validUntil).toLocaleDateString() : "",
      m.personalDetails?.gender || "",
      m.personalDetails?.address || "",
      m.personalDetails?.city || "",
      m.personalDetails?.state || "",
      m.personalDetails?.pincode || "",
      m.professionalDetails?.employeeId || "",
      m.professionalDetails?.joiningDate || "",
      m.professionalDetails?.experience || "",
      m.professionalDetails?.specialization || "",
    ]);

    const htmlTable = [
      "<table>",
      "<thead>",
      "<tr>" + headers.map((h) => "<th>" + h + "</th>").join("") + "</tr>",
      "</thead>",
      "<tbody>",
      rows
        .map(
          (row) =>
            "<tr>" +
            row.map((cell) => "<td>" + cell + "</td>").join("") +
            "</tr>"
        )
        .join(""),
      "</tbody>",
      "</table>",
    ].join("");

    const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `memberships_${new Date().toISOString().split("T")[0]}.xls`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = filteredMemberships.reduce(
    (sum, m) => sum + m.paymentAmount,
    0
  );
  const activeMemberships = memberships.filter(
    (m) => m.status === "active"
  ).length;
  const pendingMemberships = memberships.filter(
    (m) => m.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-700 font-medium mb-2">
          Error Loading Memberships
        </div>
        <div className="text-red-600 text-sm">{error}</div>
        <Button onClick={fetchMemberships} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[#19417d] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">
              Total Memberships
            </span>
            <svg
              className="w-8 h-8 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold" style={{ color: "white" }}>
            {memberships.length}
          </div>
          <div className="text-white/80 text-sm mt-1">All time members</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">
              Active Members
            </span>
            <svg
              className="w-8 h-8 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold" style={{ color: "white" }}>
            {activeMemberships}
          </div>
          <div className="text-white/80 text-sm mt-1">Currently active</div>
        </div>

        <div className="bg-gradient-to-br from-[var(--accent)] to-yellow-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">
              Pending Approval
            </span>
            <svg
              className="w-8 h-8 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold" style={{ color: "white" }}>
            {pendingMemberships}
          </div>
          <div className="text-white/80 text-sm mt-1">Awaiting approval</div>
        </div>

        <div className="bg-gradient-to-br from-[var(--secondary)] to-[#2a5f8f] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">
              Total Revenue
            </span>
            <svg
              className="w-8 h-8 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold" style={{ color: "white" }}>
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-white/80 text-sm mt-1">From memberships</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Name, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="ordinary">Ordinary</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={exportToCSV} variant="primary" className="flex-1">
              Export CSV
            </Button>
            <Button
              onClick={exportToExcel}
              variant="secondary"
              className="flex-1"
            >
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredMemberships.length} of {memberships.length} memberships
      </div>

      {/* Memberships Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMemberships.length === 0 ? (
                <tr>
                  <td
                    colSpan={16}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No memberships found
                  </td>
                </tr>
              ) : (
                filteredMemberships.map((membership) => (
                  <tr
                    key={
                      membership.id || membership._id || membership.membershipId
                    }
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--primary)]">
                      {membership.membershipId || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(membership.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {membership.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {membership.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {membership.mobile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {membership.personalDetails?.dateOfBirth
                        ? new Date(
                            membership.personalDetails.dateOfBirth
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {membership.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {membership.division}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {membership.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          membership.type === "lifetime"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {membership.type.charAt(0).toUpperCase() +
                          membership.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          membership.status === "active"
                            ? "bg-green-100 text-green-700"
                            : membership.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : membership.status === "expired"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {membership.status.charAt(0).toUpperCase() +
                          membership.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(membership.paymentAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          membership.paymentStatus === "completed"
                            ? "bg-green-100 text-green-700"
                            : membership.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {membership.paymentStatus.charAt(0).toUpperCase() +
                          membership.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      {membership.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {membership.validFrom
                        ? new Date(membership.validFrom).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {membership.type === "lifetime"
                        ? "Lifetime"
                        : membership.validUntil
                        ? new Date(membership.validUntil).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
