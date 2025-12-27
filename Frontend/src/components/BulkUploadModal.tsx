import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import Spinner from "./Spinner";
import { bulkUploadMembers } from "../services/api";

interface BulkUploadResult {
  row: number;
  membershipId?: string;
  name?: string;
  email?: string;
  status?: string;
  validFrom?: string;
  validUntil?: string;
  message?: string;
  needsProfileCompletion?: boolean;
  incompleteFields?: string[];
  data?: Record<string, unknown>;
  error?: string;
}

interface UploadResults {
  success: BulkUploadResult[];
  failed: BulkUploadResult[];
  total: number;
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext || "")) {
      setError("Only CSV and Excel files are supported");
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const response = await bulkUploadMembers(file);

      if (response.success && response.results) {
        setResults(response.results);
        if (response.results.failed.length === 0) {
          // All successful, call onSuccess after a short delay
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setError(response.message || "Upload failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload file"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const ext = droppedFile.name.split(".").pop()?.toLowerCase();
      if (!["csv", "xlsx", "xls"].includes(ext || "")) {
        setError("Only CSV and Excel files are supported");
        return;
      }

      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setFile(droppedFile);
      setError(null);
      setResults(null);
    }
  };

  const resetModal = () => {
    setFile(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    resetModal();
    onClose();
  };

  const downloadTemplate = () => {
    const template = `Membership ID,Date Created,Name,Email,Mobile,Date of Birth,Designation,Division,Department,Type,Status,Amount,Payment Status,Payment Method,Transaction ID,Valid From,Valid Until
,26 Dec 2025,John Doe,john.doe@example.com,9876543210,15 Feb 2023,JE,Bhusawal,Mechanical,Lifetime,Active,₹10000,Completed,netbanking,pay_123456,26 Dec 2025,Lifetime
,25 Dec 2025,Jane Smith,jane.smith@example.com,9876543211,10 Dec 2025,JE,Bhusawal,Electrical,Lifetime,Active,₹10000,Completed,netbanking,pay_123457,25 Dec 2025,Lifetime`;

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `membership_template_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900">
              Bulk Upload Memberships
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {!results ? (
              <>
                {/* Upload Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-900 space-y-2">
                    <p className="font-medium">📋 Upload Instructions:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>
                        Supported formats: CSV, Excel (.xlsx, .xls)
                      </li>
                      <li>
                        <strong>Minimum required:</strong> Name and Mobile only
                      </li>
                      <li>
                        Missing fields (email, designation, etc.) will be marked for profile completion
                      </li>
                      <li>
                        Users with incomplete profiles will be notified to complete them upon login
                      </li>
                      <li>Maximum file size: 5MB</li>
                      <li>
                        Date format: DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD
                      </li>
                    </ul>
                  </div>
                </div>

                {/* File Input */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                    file
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  } cursor-pointer`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {file ? (
                    <>
                      <svg
                        className="w-12 h-12 text-green-600 mx-auto mb-2"
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
                      <p className="text-green-900 font-medium">{file.name}</p>
                      <p className="text-green-700 text-sm">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-900 font-medium">
                        Drop your file here or click to select
                      </p>
                      <p className="text-gray-600 text-sm">
                        CSV or Excel files up to 5MB
                      </p>
                    </>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Template Download */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    📁 Need help with the format? Download a template:
                  </p>
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition text-sm font-medium"
                  >
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download CSV Template
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Results */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-900">
                        {results.total}
                      </div>
                      <p className="text-blue-700 text-sm">Total Records</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-900">
                        {results.success.length}
                      </div>
                      <p className="text-green-700 text-sm">Successful</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-red-900">
                        {results.failed.length}
                      </div>
                      <p className="text-red-700 text-sm">Failed</p>
                    </div>
                  </div>
                </div>

                {/* Success Results */}
                {results.success.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-3">
                      ✅ Successfully Added ({results.success.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.success.map((item, idx) => (
                        <div
                          key={idx}
                          className={`bg-white p-3 rounded border ${
                            item.needsProfileCompletion
                              ? "border-yellow-300"
                              : "border-green-200"
                          } text-sm`}
                        >
                          <div className="font-medium text-green-900">
                            Row {item.row}: {item.name}
                          </div>
                          <div className="text-green-700">
                            ID: {item.membershipId} | Status: {item.status}
                          </div>
                          <div className="text-green-600 text-xs">
                            {item.email}
                          </div>
                          {item.needsProfileCompletion && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
                              ⚠️ User needs to complete profile: {item.incompleteFields?.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failed Results */}
                {results.failed.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-3">
                      ❌ Failed ({results.failed.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.failed.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded border border-red-200 text-sm"
                        >
                          <div className="font-medium text-red-900">
                            Row {item.row}
                          </div>
                          <div className="text-red-700">{item.error}</div>
                          {item.email && (
                            <div className="text-red-600 text-xs">
                              {item.email}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
            {results ? (
              <>
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
                {results.failed.length > 0 && (
                  <Button
                    variant="primary"
                    onClick={resetModal}
                  >
                    Upload Again
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Uploading...
                    </div>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
