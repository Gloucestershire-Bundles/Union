import { ReferralStatus } from "@/types/ReferralStatus";
import React from "react";
import { Badge } from "../ui/badge";
import { CircleDot } from "lucide-react";

interface ReferralStatusBadgeProps {
  status: ReferralStatus;
}

const statusColours: Record<ReferralStatus, string> = {
  [ReferralStatus.REVIEW]: "bg-blue-500 text-white dark:bg-blue-800",
  [ReferralStatus.ACCEPTED]: "bg-green-500 text-white dark:bg-green-800",
  [ReferralStatus.REJECTED]: "bg-red-500 text-white dark:bg-red-800",
  [ReferralStatus.IN_PROGRESS]: "bg-yellow-500 text-white dark:bg-yellow-800",
  [ReferralStatus.READY]: "bg-purple-500 text-white dark:bg-purple-800",
  [ReferralStatus.COLLECTED]: "bg-teal-500 text-white dark:bg-teal-800",
  [ReferralStatus.NOT_COLLECTED]: "bg-gray-500 text-white dark:bg-gray-800",
  [ReferralStatus.WITHDRAWN]: "bg-orange-500 text-white dark:bg-orange-800",
  [ReferralStatus.ARCHIVED]: "bg-zinc-500 text-white dark:bg-zinc-800",
};

export const mapReferralStatus = (status: string): ReferralStatus => {
  switch (status.toLowerCase()) {
    case "review":
      return ReferralStatus.REVIEW;
    case "accepted":
      return ReferralStatus.ACCEPTED;
    case "rejected":
      return ReferralStatus.REJECTED;
    case "in progress":
      return ReferralStatus.IN_PROGRESS;
    case "ready":
      return ReferralStatus.READY;
    case "collected":
      return ReferralStatus.COLLECTED;
    case "not collected":
      return ReferralStatus.NOT_COLLECTED;
    case "withdrawn":
      return ReferralStatus.WITHDRAWN;
    case "archived":
      return ReferralStatus.ARCHIVED;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

export const ReferralStatusBadge: React.FC<ReferralStatusBadgeProps> = ({
  status,
}) => {
  const statusClasses = statusColours[status] || "bg-blue-500 text-white dark:bg-blue-600";

  return (
    <Badge
      variant="secondary"
      className={statusClasses}
    >
      <CircleDot />
      {status}
    </Badge>
  );
};
