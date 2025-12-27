import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDepartmentStats } from "../services/api";

interface DepartmentStat {
  department: string;
  count: number;
}

interface DepartmentTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  division: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function DepartmentModal({
  isOpen,
  onClose,
  division,
  triggerRef,
}: DepartmentTooltipProps) {
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !division) {
      setDepartmentStats([]);
      setError(null);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await getDepartmentStats(division);
        setDepartmentStats(stats);
      } catch (err) {
        console.error("Failed to fetch department stats:", err);
        setError("Failed to load department statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isOpen, division]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const totalMembers = departmentStats.reduce(
    (sum, dept) => sum + dept.count,
    0
  );

  // Sort departments in the order specified: Electrical, Mechanical, Engineering, Signal & Telecommunication
  const departmentOrder = [
    "Electrical",
    "Mechanical",
    "Engineering",
    "Signal & Telecommunication",
  ];
  const sortedStats = [...departmentStats].sort((a, b) => {
    const indexA = departmentOrder.indexOf(a.department);
    const indexB = departmentOrder.indexOf(b.department);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.85, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-80"
          style={{
            top: triggerRef.current
              ? triggerRef.current.getBoundingClientRect().bottom + 12
              : "50%",
            left: triggerRef.current
              ? Math.max(
                  12,
                  triggerRef.current.getBoundingClientRect().left +
                    triggerRef.current.getBoundingClientRect().width / 2 -
                    160
                )
              : "50%",
            transform: triggerRef.current ? "none" : "translate(-50%, -50%)",
          }}
        >
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-sm font-bold text-[var(--primary)]">
              {division}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Department Breakdown</p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[var(--primary)] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="py-3 px-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {error}
            </div>
          ) : departmentStats.length === 0 ? (
            <div className="py-3 text-center text-gray-500 text-xs">
              No members found.
            </div>
          ) : (
            <div className="space-y-2.5">
              {sortedStats.map((dept) => {
                const percentage =
                  totalMembers > 0 ? (dept.count / totalMembers) * 100 : 0;
                return (
                  <div key={dept.department} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">
                        {dept.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[var(--primary)]">
                          {dept.count}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {percentage.toFixed(0)}%
                        </span>
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Total Section */}
              <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">
                  Total
                </span>
                <span className="text-sm font-bold text-[var(--primary)]">
                  {totalMembers} members
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
