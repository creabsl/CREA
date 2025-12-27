import type { User } from "../services/api";

export interface ProfileCompletionDetails {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  totalFields: number;
  completedCount: number;
}

export function calculateProfileCompletion(
  user: User | null
): ProfileCompletionDetails {
  if (!user) {
    return {
      percentage: 0,
      completedFields: [],
      missingFields: [
        "Name",
        "Mobile Number",
        "Designation",
        "Division",
        "Department",
        "Date of Birth",
      ],
      totalFields: 6,
      completedCount: 0,
    };
  }

  const fields = [
    { name: "Name", value: user.name },
    { name: "Mobile Number", value: user.mobile },
    { name: "Designation", value: user.designation },
    { name: "Division", value: user.division },
    { name: "Department", value: user.department },
    { name: "Date of Birth", value: user.dateOfBirth },
  ];

  const completedFields: string[] = [];
  const missingFields: string[] = [];

  fields.forEach((field) => {
    if (field.value && field.value.toString().trim().length > 0) {
      completedFields.push(field.name);
    } else {
      missingFields.push(field.name);
    }
  });

  const percentage = Math.round((completedFields.length / fields.length) * 100);

  return {
    percentage,
    completedFields,
    missingFields,
    totalFields: fields.length,
    completedCount: completedFields.length,
  };
}

export function getCompletionBadgeColor(percentage: number): string {
  if (percentage === 100) return "green";
  if (percentage >= 75) return "blue";
  if (percentage >= 50) return "yellow";
  return "red";
}

export function getCompletionMessage(percentage: number): string {
  if (percentage === 100) return "🎉 Your profile is complete! Great job!";
  if (percentage >= 75) return "Almost there! Just a few more details needed.";
  if (percentage >= 50) return "You're halfway! Keep going.";
  return "Let's complete your profile to unlock all features!";
}
