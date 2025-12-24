// Centralized list of supported divisions used across the app
export const DIVISIONS = [
  "Bhusawal",
  "Pune",
  "Solapur",
  "Nagpur",
  "Mumbai",
] as const;
export type Division = (typeof DIVISIONS)[number];

export type MemberCount = {
  division: Division;
  count: number;
};

export type EventItem = {
  id: string;
  title: string;
  date: string; // ISO
  location: string;
  description: string;
  photos: string[];
  breaking?: boolean;
};

export type Circular = {
  id: string;
  boardNumber: string;
  subject: string;
  dateOfIssue: string;
  url?: string;
};

export type CourtCase = {
  id: string;
  caseNumber: string;
  date: string;
  subject: string;
};

export type ManualCategory =
  | "technical"
  | "social"
  | "organizational"
  | "general";
export type Manual = {
  id: string;
  title: string;
  url?: string;
  category?: ManualCategory;
};

export type BodyMember = {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  division: Division;
};

export type ForumCategory =
  | "technical"
  | "social"
  | "organizational"
  | "general";
export type ForumTopic = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  replies: number;
  category?: ForumCategory;
};
export type ForumComment = {
  author: string;
  content: string;
  createdAt?: string;
  createdAtStr?: string;
};
export type ForumPost = {
  id: string;
  topicId: string;
  author: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  comments?: ForumComment[];
};

export type PendingForumPost = {
  _id: string;
  id: string;
  topicId: string;
  topicTitle: string;
  author: string;
  content: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
};

export type PendingForumComment = {
  _id: string;
  id: string;
  postId: string;
  author: string;
  topicTitle: string;
  postContent: string;
  commentIndex: number;
  content: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
};

export type Suggestion = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  fileNames: string[];
  createdAt: string;
};

export type MutualTransfer = {
  id: string;
  post: string; // Legacy field for backward compatibility
  currentDesignation: string;
  currentDivision: string;
  currentDepartment: string;
  currentLocation: string;
  desiredDesignation: string;
  desiredLocation: string;
  availabilityDate: string | null;
  notes: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  ownerId: string;
  ownerDesignation: string;
  ownerDivision: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MembershipType = "ordinary" | "lifetime";
export type PaymentMethod = "upi" | "card" | "netbanking" | "qr";
export type PaymentStatus = "pending" | "completed" | "failed";
export type MembershipStatus = "pending" | "active" | "expired" | "rejected";

export type Membership = {
  id: string;
  _id?: string;
  membershipId: string;
  name: string;
  designation: string;
  division: Division;
  department: string;
  place: string;
  unit: string;
  mobile: string;
  email: string;
  type: MembershipType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  paymentDate?: string;
  paymentReference?: string;
  status: MembershipStatus;
  validFrom?: string;
  validUntil?: string;
  personalDetails: {
    dateOfBirth?: string;
    gender?: "male" | "female" | "other";
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  professionalDetails: {
    employeeId?: string;
    joiningDate?: string;
    experience?: number;
    specialization?: string;
  };
  documents?: Array<{
    type: "idProof" | "photo" | "signature" | "other";
    url: string;
    uploadedAt: string;
  }>;
  renewalHistory?: Array<{
    renewalDate: string;
    paymentReference: string;
    amount: number;
    type: "new" | "renewal";
  }>;
  createdAt: string;
  updatedAt: string;
};

export type ExternalLinkCategory =
  | "government"
  | "industry"
  | "organization"
  | "other";

export type ExternalLink = {
  id: string;
  title: string;
  url: string;
  category: ExternalLinkCategory;
  description?: string;
  order: number;
  isActive: boolean;
};

export type DonationPurpose =
  | "general"
  | "education"
  | "welfare"
  | "infrastructure";

export type Donation = {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  isEmployee: boolean;
  employeeId?: string;
  designation?: string;
  division?: string;
  department?: string;
  amount: number;
  purpose: DonationPurpose;
  isAnonymous: boolean;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  message?: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentReference?: string;
  paymentDate?: string;
  paymentMethod?: "upi" | "card" | "netbanking" | "wallet";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  upiId?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdvertisementType = "announcement" | "achievement" | "notification";
export type AdvertisementPriority = "high" | "medium" | "low";

export type Advertisement = {
  _id: string;
  title: string;
  description: string;
  type: AdvertisementType;
  priority: AdvertisementPriority;
  link?: string;
  imageUrl?: string;
  videoUrl?: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type AchievementType = "award" | "courtCase" | "milestone";

export type Achievement = {
  _id: string;
  type: AchievementType;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  photos?: string[];
  category?: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type BreakingNews = {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  priority: number;
  isActive: boolean;
  expiresAt?: string | null;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};
