import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../context/auth";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import FileUploader from "../components/FileUploader";
import Modal from "../components/Modal";
import Input from "../components/Input";
import { format } from "date-fns";
import { getCirculars, getManuals, getCourtCases } from "../services/api";
import type { Circular, Manual, CourtCase } from "../types";

// Backend API URL for file access (normalized)
const API_URL = (
  import.meta.env?.VITE_API_URL || "https://api.crea.org.in"
).replace(/\/+$|\/api$/i, "");

type DocumentType = "circular" | "manual" | "court-case";

interface Document extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  date: string;
  type: DocumentType;
  fileUrl: string;
  // Circular specific
  boardNumber?: string;
  category?: string;
  // Manual specific
  section?: string;
  // Court case specific
  status?: string;
  caseNumber?: string;
  courtName?: string;
  nextHearingDate?: string;
}

const TABS: { value: DocumentType; label: string; icon: React.ReactNode }[] = [
  {
    value: "circular",
    label: "Circulars",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    value: "manual",
    label: "Manuals",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    value: "court-case",
    label: "Court Cases",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  },
];

export default function Documents() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as DocumentType | null;
  const [activeTab, setActiveTab] = useState<DocumentType>(
    tabFromUrl && ["circular", "manual", "court-case"].includes(tabFromUrl)
      ? tabFromUrl
      : "circular"
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const getAdminSubTab = (t: DocumentType) => {
    switch (t) {
      case "circular":
        return "circulars";
      case "manual":
        return "manuals";
      case "court-case":
        return "court-cases";
    }
  };

  // Fetch documents from API
  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        const [circulars, manuals, courtCases] = await Promise.all([
          getCirculars(),
          getManuals(),
          getCourtCases(),
        ]);

        // Helper to build full URL for files
        const getFullUrl = (url: string | undefined): string => {
          if (!url || url === "#") return "#";
          // If it's already a full URL (http/https), return as-is
          if (url.startsWith("http://") || url.startsWith("https://"))
            return url;
          // Otherwise, prepend the API URL
          return `${API_URL}${url}`;
        };

        const allDocs: Document[] = [
          // Transform circulars
          ...circulars.map(
            (c: Circular): Document => ({
              id: c.id,
              title: c.subject,
              description: `Board Number: ${c.boardNumber}`,
              date: c.dateOfIssue,
              type: "circular",
              fileUrl: getFullUrl(c.url),
              boardNumber: c.boardNumber,
            })
          ),
          // Transform manuals
          ...manuals.map(
            (m: Manual): Document => ({
              id: m.id,
              title: m.title,
              description: "Manual document",
              date: m.date || "",
              type: "manual",
              fileUrl: getFullUrl(m.url),
              category: m.category,
            })
          ),
          // Transform court cases
          ...courtCases.map(
            (cc: CourtCase): Document => ({
              id: cc.id,
              title: cc.subject,
              description: `Case Number: ${cc.caseNumber}`,
              date: cc.date,
              type: "court-case",
              fileUrl: getFullUrl(cc.url),
              caseNumber: cc.caseNumber,
            })
          ),
        ];
        setDocuments(allDocs);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Update tab when URL changes
  useEffect(() => {
    if (
      tabFromUrl &&
      ["circular", "manual", "court-case"].includes(tabFromUrl)
    ) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  usePageTitle("CREA • Documents");

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.type === activeTab &&
      (doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getColumns = (type: DocumentType) => {
    const baseColumns = [
      {
        key: "title" as keyof Document,
        header: "Title",
        render: (row: Document) => (
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        ),
      },
      {
        key: "date" as keyof Document,
        header: "Date",
        render: (row: Document) =>
          row.date ? format(new Date(row.date), "MMM d, yyyy") : "-",
      },
      {
        key: "fileUrl" as keyof Document,
        header: "File",
        render: (row: Document) =>
          row.fileUrl && row.fileUrl !== "#" ? (
            <button
              onClick={() =>
                window.open(row.fileUrl, "_blank", "noopener,noreferrer")
              }
              className="text-[var(--primary)] hover:text-[var(--accent)] flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer text-xs sm:text-sm font-medium"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="hidden sm:inline">View Document</span>
              <span className="sm:hidden">View</span>
              <svg
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-50 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>
          ) : (
            <span className="text-gray-400 text-xs sm:text-sm">No file</span>
          ),
      },
    ];

    if (type === "circular") {
      return [
        ...baseColumns,
        {
          key: "boardNumber" as keyof Document,
          header: "Board Number",
          render: (row: Document) => row.boardNumber || "-",
        },
      ];
    }

    if (type === "manual") {
      return [
        ...baseColumns.slice(0, 1), // Title column
        {
          key: "category" as keyof Document,
          header: "Category",
          render: (row: Document) =>
            row.category ? (
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                {row.category.charAt(0).toUpperCase() + row.category.slice(1)}
              </span>
            ) : (
              <span className="text-gray-400">General</span>
            ),
        },
        ...baseColumns.slice(1), // Date and File columns
      ];
    }

    if (type === "court-case") {
      return [
        baseColumns[0], // Title column
        baseColumns[1], // Date column
        {
          key: "caseNumber" as keyof Document,
          header: "Case Number",
          render: (row: Document) => row.caseNumber || "-",
        },
        baseColumns[2], // File column
      ];
    }

    return baseColumns;
  };

  const getAddButtonText = (type: DocumentType) => {
    switch (type) {
      case "circular":
        return "Add Circular";
      case "manual":
        return "Add Manual";
      case "court-case":
        return "Add Court Case";
    }
  };

  const getTabIcon = (type: DocumentType) => {
    switch (type) {
      case "circular":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "manual":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "court-case":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Responsive Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-[var(--primary)] truncate">
                  Document Repository
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                  Circulars, Manuals & Legal Records
                </p>
              </div>
            </div>
            {isAdmin && (
              <Button
                onClick={() =>
                  navigate(
                    `/admin?tab=documents&subTab=${getAdminSubTab(activeTab)}`
                  )
                }
                className="text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {getAddButtonText(activeTab)}
                </span>
                <span className="sm:hidden">
                  Add{" "}
                  {activeTab === "circular"
                    ? "Circular"
                    : activeTab === "manual"
                    ? "Manual"
                    : "Case"}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Responsive Tab Navigation */}
        <div className="overflow-x-auto scrollbar-hide border-b border-gray-200 bg-gray-50">
          <div className="flex px-3 sm:px-6 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.value
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.label
                    .replace("Circulars", "Docs")
                    .replace("Court Cases", "Cases")}
                </span>
                <span
                  className={`ml-0.5 sm:ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full ${
                    activeTab === tab.value
                      ? "bg-blue-100 text-[var(--primary)]"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {documents.filter((d) => d.type === tab.value).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Search Bar */}
        <div className="p-3 sm:p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              placeholder={`Search ${
                activeTab === "circular"
                  ? "circulars"
                  : activeTab === "manual"
                  ? "manuals"
                  : "court cases"
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            />
          </div>
        </div>
      </div>

      {/* Document Content */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[var(--primary)] border-t-transparent mb-3"></div>
            <p className="text-sm text-gray-500">Loading documents...</p>
          </div>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DataTable columns={getColumns(activeTab)} data={filteredDocuments} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="inline-flex p-3 bg-gray-100 rounded-lg mb-3">
              <div className="text-gray-400">{getTabIcon(activeTab)}</div>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No Documents Found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery
                ? `No documents match "${searchQuery}"`
                : `No ${
                    activeTab === "circular"
                      ? "circulars"
                      : activeTab === "manual"
                      ? "manuals"
                      : "court cases"
                  } available`}
            </p>
            {!searchQuery && isAdmin && (
              <Button
                onClick={() =>
                  navigate(
                    `/admin?tab=documents&subTab=${getAdminSubTab(activeTab)}`
                  )
                }
                className="text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Document
              </Button>
            )}
          </div>
        </div>
      )}

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={getAddButtonText(activeTab)}
      >
        <form className="space-y-4">
          <Input label="Title *" placeholder="Enter document title" />
          <Input label="Description" placeholder="Enter document description" />

          {activeTab === "circular" && (
            <Input label="Category" placeholder="Enter document category" />
          )}

          {activeTab === "manual" && (
            <Input label="Section" placeholder="Enter manual section" />
          )}

          {activeTab === "court-case" && (
            <>
              <Input label="Case Number *" placeholder="Enter case number" />
              <Input label="Court Name *" placeholder="Enter court name" />
              <Input type="date" label="Next Hearing Date" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-blue-500">
                  <option value="ongoing">Ongoing</option>
                  <option value="closed">Closed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </>
          )}

          <div className="mt-6">
            <FileUploader
              accept=".pdf,.doc,.docx"
              maxFiles={1}
              onFiles={() => {}}
              hint="Upload document (PDF, DOC, DOCX)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Document</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
