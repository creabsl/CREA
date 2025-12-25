import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import Input from "./Input";
import Spinner from "./Spinner";
import {
  getAllAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from "../services/api";
import type { Advertisement } from "../types";

export default function AdvertisementsAdmin() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [type, setType] = useState<
    "announcement" | "promotion" | "event" | "achievement"
  >("announcement");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [link, setLink] = useState("");
  const [priority, setPriority] = useState<"high" | "normal">("normal");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadAdvertisements();
  }, []);

  const loadAdvertisements = async () => {
    try {
      setLoading(true);
      const data = await getAllAdvertisements();
      setAdvertisements(data);
    } catch (error) {
      console.error("Error loading advertisements:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setType("announcement");
    setTitle("");
    setDescription("");
    setImageUrl("");
    setVideoUrl("");
    setLink("");
    setPriority("normal");
    setIsActive(true);
    setStartDate("");
    setEndDate("");
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingId(ad._id);
    setType(ad.type);
    setTitle(ad.title);
    setDescription(ad.description);
    setImageUrl(ad.imageUrl || "");
    setVideoUrl(ad.videoUrl || "");
    setLink(ad.link || "");
    setPriority(ad.priority);
    setIsActive(ad.isActive);
    setStartDate(ad.startDate ? ad.startDate.split("T")[0] : "");
    setEndDate(ad.endDate ? ad.endDate.split("T")[0] : "");
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;
    try {
      await deleteAdvertisement(id);
      await loadAdvertisements();
      alert("Advertisement deleted successfully!");
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      alert("Failed to delete advertisement");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        type,
        title,
        description,
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
        link: link || undefined,
        priority,
        isActive,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      };

      if (editingId) {
        await updateAdvertisement(editingId, data);
        alert("Advertisement updated successfully!");
      } else {
        await createAdvertisement(data);
        alert("Advertisement created successfully!");
      }

      await loadAdvertisements();
      resetForm();
    } catch (error) {
      console.error("Error saving advertisement:", error);
      alert("Failed to save advertisement");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Carousel
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage the rotating advertisements shown on the dashboard homepage
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-[var(--primary)] hover:bg-[#19417d]"
        >
          {isEditing ? "Cancel" : "+ Add Advertisement"}
        </Button>
      </div>

      {isEditing && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit" : "New"} Advertisement
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value as
                        | "announcement"
                        | "promotion"
                        | "event"
                        | "achievement"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                >
                  <option value="announcement">Announcement</option>
                  <option value="promotion">Promotion</option>
                  <option value="event">Event</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as "high" | "normal")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                >
                  <option value="normal">Normal</option>
                  <option value="high">
                    High Priority (Shows "HIGH PRIORITY" badge)
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter advertisement title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Enter advertisement description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg or https://api.crea.org.in/uploads/ads/file.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload image to backend /uploads/ads/ folder or use external
                  URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL (Optional)
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube URL or direct video link"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports YouTube and direct video links
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learn More Link (Optional)
                </label>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com/details"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Shows "Learn More" button if provided
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (Optional)
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  When to start showing this ad
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  When to stop showing this ad
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active (Show in carousel)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                className="bg-[var(--primary)] hover:bg-[#19417d]"
              >
                {editingId ? "Update" : "Create"} Advertisement
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : advertisements.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No advertisements found. Create your first carousel item!
                  </td>
                </tr>
              ) : (
                advertisements.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {ad.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {ad.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          ad.type === "announcement"
                            ? "bg-blue-100 text-blue-700"
                            : ad.type === "promotion"
                            ? "bg-green-100 text-green-700"
                            : ad.type === "achievement"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {ad.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ad.priority === "high" ? (
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-700">
                          HIGH
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-700">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ad.imageUrl && (
                        <span className="inline-flex items-center gap-1 text-blue-600">
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
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Image
                        </span>
                      )}
                      {ad.imageUrl && ad.videoUrl && (
                        <span className="mx-1">+</span>
                      )}
                      {ad.videoUrl && (
                        <span className="inline-flex items-center gap-1 text-purple-600">
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
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Video
                        </span>
                      )}
                      {!ad.imageUrl && !ad.videoUrl && (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          ad.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(ad)}
                        className="text-[var(--primary)] hover:text-[#19417d] mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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
